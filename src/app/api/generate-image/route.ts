import { NextResponse } from "next/server";

import { getAuthenticatedUser, isAdminEmail } from "@/lib/admin-auth";
import { generateImageWithQuota } from "@/lib/generate-image-core";
import { IMAGE_MODEL, openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { uploadBase64ImageToStorage } from "@/lib/storage";
import { refundGeneration, tryConsumeGeneration } from "@/lib/user-credits";
import { validateAndNormalizeReference } from "@/lib/validate-image";

// Image edits with a reference take noticeably longer than plain generations.
export const maxDuration = 60;

type RequestBody = {
  prompt?: string;
  creationType?: "wall" | "object" | "light";
  withFrame?: boolean;
};

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

    // JSON for plain generations, multipart when a reference image is attached.
    const isMultipart = (request.headers.get("content-type") ?? "").includes(
      "multipart/form-data",
    );
    let body: RequestBody;
    let referenceFile: File | null = null;

    if (isMultipart) {
      const formData = await request.formData();
      const rawWithFrame = formData.get("withFrame");
      const rawCreationType = formData.get("creationType");
      const rawReference = formData.get("reference");

      body = {
        prompt:
          typeof formData.get("prompt") === "string"
            ? (formData.get("prompt") as string)
            : undefined,
        creationType:
          rawCreationType === "object" || rawCreationType === "light"
            ? rawCreationType
            : "wall",
        withFrame: rawWithFrame === "true",
      };
      referenceFile =
        rawReference instanceof File && rawReference.size > 0
          ? rawReference
          : null;
    } else {
      body = (await request.json()) as RequestBody;
    }

    const prompt = body?.prompt?.trim();
    const creationType = body?.creationType ?? "wall";
    const withFrame = Boolean(body?.withFrame);

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

    // Validate the reference before claiming a slot, so a bad file never costs
    // the user a generation. The client maps `referenceError` to a translation.
    let referenceBuffer: Buffer | null = null;

    if (referenceFile) {
      const reference = await validateAndNormalizeReference(referenceFile);

      if (!reference.ok) {
        return NextResponse.json(
          { error: "Image de référence invalide.", referenceError: reference.code },
          { status: 400 },
        );
      }

      referenceBuffer = reference.buffer;
    }

    const isAdmin = isAdminEmail(user.email);

    // Claim a slot, generate, convert to WebP and refund on any failure; this
    // route only decides where the finished image is stored.
    const result = await generateImageWithQuota({
      userId: user.id,
      isAdmin,
      prompt,
      creationType,
      withFrame,
      referenceBuffer,
      persist: async ({ dataUrl }) => {
        const imageUrl = await uploadBase64ImageToStorage(dataUrl);
        const savedImage = await prisma.generatedImage.create({
          data: {
            supabaseUserId: user.id,
            prompt,
            imageUrl,
          },
        });
        return savedImage.id;
      },
      deps: {
        openai,
        fetch: globalThis.fetch,
        model: IMAGE_MODEL,
        apiKey: process.env.OPENAI_API_KEY,
        tryConsumeGeneration,
        refundGeneration,
      },
    });

    if (!result.ok) {
      return NextResponse.json(result.body, { status: result.status });
    }

    return NextResponse.json({
      image: result.image,
      ...result.quota,
      ...(result.persisted ? { imageId: result.persisted } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur pendant la génération." },
      { status: 500 },
    );
  }
}
