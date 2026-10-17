import { NextResponse } from "next/server";
import { toFile } from "openai";
import sharp from "sharp";

import { getAuthenticatedUser, isAdminEmail } from "@/lib/admin-auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { uploadBase64ImageToStorage } from "@/lib/storage";
import {
  refundGeneration,
  tryConsumeGeneration,
  type GenerationQuota,
} from "@/lib/user-credits";
import { validateAndNormalizeReference } from "@/lib/validate-image";

// Image edits with a reference take noticeably longer than plain generations.
export const maxDuration = 60;

type RequestBody = {
  prompt?: string;
  creationType?: "wall" | "object" | "light";
  withFrame?: boolean;
};

// "high" copies the reference more faithfully but costs more input tokens; lower to "low" to save cost.
const REFERENCE_INPUT_FIDELITY = "high" as const;

const GENERATION_ERROR_MESSAGE = "Erreur serveur pendant la génération.";
const MODERATION_ERROR_MESSAGE =
  "Cette image ou cette description ne peut pas être utilisée. Essayez avec une autre image ou reformulez votre idée.";

function isModerationRejection(error: unknown) {
  const { status, code, message } = error as {
    status?: unknown;
    code?: unknown;
    message?: unknown;
  };

  return (
    status === 400 &&
    /moderation|safety/i.test(`${String(code ?? "")} ${String(message ?? "")}`)
  );
}

const REFERENCE_PROMPT_PREFIX =
  "Use the provided image as a visual reference for the shape, composition, materials and mood of the sculpture. Do not copy it literally. ";

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

    let imageBase64: string | undefined;

    if (referenceBuffer) {
      try {
        const edited = await openai.images.edit({
          model: "gpt-image-1",
          image: await toFile(referenceBuffer, "reference.png", {
            type: "image/png",
          }),
          prompt: `${REFERENCE_PROMPT_PREFIX}${reinforcedPrompt}`,
          size: imageSize,
          input_fidelity: REFERENCE_INPUT_FIDELITY,
        });
        imageBase64 = edited.data?.[0]?.b64_json;
      } catch (editError) {
        await refundIfConsumed();

        if (isModerationRejection(editError)) {
          return NextResponse.json(
            { error: MODERATION_ERROR_MESSAGE },
            { status: 400 },
          );
        }

        // Keep OpenAI's internal message server-side only.
        console.error("OpenAI image edit failed:", editError);
        const status =
          typeof (editError as { status?: unknown })?.status === "number"
            ? (editError as { status: number }).status
            : 500;
        return NextResponse.json(
          { error: GENERATION_ERROR_MESSAGE },
          { status },
        );
      }
    } else {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        await refundIfConsumed();
        return NextResponse.json(
          { error: data?.error?.message || "Erreur OpenAI." },
          { status: response.status },
        );
      }

      imageBase64 = data?.data?.[0]?.b64_json;
    }

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
