import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadBase64ImageToStorage } from "@/lib/storage";
import { tryConsumeUserCredit } from "@/lib/user-credits";

type RequestBody = {
  prompt?: string;
  creationType?: "wall" | "object" | "light";
  withFrame?: boolean;
};

const FREE_GENERATION_LIMIT = 2;
const FREE_GENERATION_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    // Basic origin guard — prevents direct API abuse from other domains
    const origin = request.headers.get("origin") ?? "";
    const referer = request.headers.get("referer") ?? "";
    if (
      process.env.NODE_ENV === "production" &&
      !origin.includes("marcospapermache.com") &&
      !referer.includes("marcospapermache.com")
    ) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = (await request.json()) as RequestBody;
    const prompt = body?.prompt?.trim();
    const creationType = body?.creationType ?? "wall";
    const withFrame = Boolean(body?.withFrame);
    const imageSize = creationType === "wall" ? "1024x1536" : "1024x1024";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt manquant." }, { status: 400 });
    }

    const user = await getAuthenticatedUser();
    let paidCreditsRemaining: number | undefined;

    if (user) {
      const creditResult = await tryConsumeUserCredit(user.id);

      if (!creditResult.allowed) {
        return NextResponse.json(
          {
            error:
              "Vous n’avez plus de générations disponibles. Achetez un pack pour continuer.",
            requiresPayment: true,
          },
          { status: 402 },
        );
      }

      paidCreditsRemaining = creditResult.remaining;
    } else {
      const ip = getClientIp(request);
      const rateLimit = checkRateLimit(
        `generate-image:${ip}`,
        FREE_GENERATION_LIMIT,
        FREE_GENERATION_WINDOW_MS,
      );

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error:
              "Vous avez atteint la limite de générations gratuites. Créez un compte pour continuer.",
            requiresSignup: true,
          },
          { status: 401 },
        );
      }
    }

    const reinforcedPrompt = withFrame
      ? `${prompt}, zoomed out composition, the full outer frame must be completely visible with comfortable margin on every side, no cropped frame, no cut edges, no partial artwork, the artwork must fit naturally inside the image`
      : `${prompt}, centered composition, complete artwork fully visible, no cropped edges`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: reinforcedPrompt,
        size: imageSize,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Erreur OpenAI." },
        { status: response.status },
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Aucune image générée." },
        { status: 500 },
      );
    }

    const image = `data:image/png;base64,${imageBase64}`;
    let imageId: string | undefined;

    try {
      const imageUrl = await uploadBase64ImageToStorage(image);
      const savedImage = await prisma.generatedImage.create({
        data: {
          supabaseUserId: user?.id ?? null,
          prompt,
          imageUrl,
        },
      });
      imageId = savedImage.id;
    } catch (persistError) {
      console.error("Failed to persist generated image:", persistError);
    }

    return NextResponse.json({
      image,
      ...(imageId ? { imageId } : {}),
      ...(paidCreditsRemaining !== undefined ? { paidCreditsRemaining } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur pendant la génération." },
      { status: 500 },
    );
  }
}
