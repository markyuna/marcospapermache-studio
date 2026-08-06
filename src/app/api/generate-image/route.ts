import { NextResponse } from "next/server";
import sharp from "sharp";

import { getAuthenticatedUser, isAdminEmail } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uploadBase64ImageToStorage } from "@/lib/storage";
import {
  refundGeneration,
  tryConsumeGeneration,
  type GenerationQuota,
} from "@/lib/user-credits";

type RequestBody = {
  prompt?: string;
  creationType?: "wall" | "object" | "light";
  withFrame?: boolean;
};

export async function POST(request: Request) {
  // Set once a generation slot has been claimed, so any failure path — including
  // the outer catch — can hand it back.
  let refundOnFailure: (() => Promise<void>) | null = null;

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

    if (!user) {
      return NextResponse.json(
        {
          error: "Créez un compte pour générer une image.",
          requiresSignup: true,
        },
        { status: 401 },
      );
    }

    const isAdmin = isAdminEmail(user.email);

    let quota: GenerationQuota | undefined;
    let consumedSource: "free" | "paid" | undefined;

    if (!isAdmin) {
      const claim = await tryConsumeGeneration(user.id);

      if (!claim.allowed) {
        return NextResponse.json(
          {
            error:
              "Votre compte gratuit est épuisé. Achetez un pack pour continuer.",
            requiresPayment: true,
            freeGenerationsRemaining: 0,
            paidCreditsRemaining: claim.quota.paidCredits,
            imagesGenerated: claim.quota.imagesGenerated,
          },
          { status: 402 },
        );
      }

      quota = claim.quota;
      consumedSource = claim.source;
    }

    // Give the claimed slot back if the generation never produces an image.
    const refundIfConsumed = async () => {
      if (!isAdmin && consumedSource) {
        const source = consumedSource;
        consumedSource = undefined;
        await refundGeneration(user.id, source);
      }
    };

    refundOnFailure = refundIfConsumed;

    const quotaPayload = () =>
      isAdmin
        ? { unlimited: true }
        : {
            freeGenerationsRemaining: quota?.freeRemaining ?? 0,
            paidCreditsRemaining: quota?.paidCredits ?? 0,
            imagesGenerated: quota?.imagesGenerated ?? 0,
          };

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
      await refundIfConsumed();
      return NextResponse.json(
        { error: data?.error?.message || "Erreur OpenAI." },
        { status: response.status },
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      await refundIfConsumed();
      return NextResponse.json(
        { error: "Aucune image générée." },
        { status: 500 },
      );
    }

    const pngBuffer = Buffer.from(imageBase64, "base64");
    const webpBuffer = await sharp(pngBuffer).webp({ quality: 80 }).toBuffer();
    const image = `data:image/webp;base64,${webpBuffer.toString("base64")}`;
    let imageId: string | undefined;

    try {
      const imageUrl = await uploadBase64ImageToStorage(image);
      const savedImage = await prisma.generatedImage.create({
        data: {
          supabaseUserId: user.id,
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
      ...quotaPayload(),
      ...(imageId ? { imageId } : {}),
    });
  } catch {
    await refundOnFailure?.();

    return NextResponse.json(
      { error: "Erreur serveur pendant la génération." },
      { status: 500 },
    );
  }
}
