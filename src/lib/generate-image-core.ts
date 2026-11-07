// src/lib/generate-image-core.ts
// The part of image generation that does not depend on where the file ends up:
// claim a slot, call OpenAI, turn the result into WebP, and hand the slot back
// on any failure. Where the image is stored is the caller's business (a
// callback), so the same core can serve a public bucket today and a private one
// tomorrow.
//
// Everything the core touches (OpenAI, fetch, quota) is injected through `deps`;
// the route passes the real ones, tests pass fakes.
import type OpenAI from "openai";
import { toFile } from "openai";
import sharp from "sharp";

import type { GenerationQuota } from "@/lib/user-credits";

export const GENERATION_ERROR_MESSAGE = "Erreur serveur pendant la génération.";
export const MODERATION_ERROR_MESSAGE =
  "Cette image ou cette description ne peut pas être utilisée. Essayez avec une autre image ou reformulez votre idée.";

const REFERENCE_PROMPT_PREFIX =
  "Use the provided image as a visual reference for the shape, composition, materials and mood of the sculpture. Do not copy it literally. ";

export type CreationType = "wall" | "object" | "light";
type QuotaSource = "free" | "paid";

export type GenerationDeps = {
  openai: Pick<OpenAI, "images">;
  fetch: typeof fetch;
  model: string;
  apiKey: string | undefined;
  tryConsumeGeneration: (userId: string) => Promise<
    | { allowed: true; source: QuotaSource; quota: GenerationQuota }
    | { allowed: false; quota: GenerationQuota }
  >;
  refundGeneration: (userId: string, source: QuotaSource) => Promise<void>;
};

export type GeneratedImageFile = {
  dataUrl: string;
  webp: Buffer;
};

export type QuotaPayload =
  | { unlimited: true }
  | {
      freeGenerationsRemaining: number;
      paidCreditsRemaining: number;
      imagesGenerated: number;
    };

export type ImageGenerationResult<T> =
  | {
      ok: true;
      // Same data URL the route has always returned to the browser.
      image: string;
      quota: QuotaPayload;
      // Whatever `persist` returned, or undefined if saving failed and the
      // policy is to deliver the image anyway.
      persisted: T | undefined;
    }
  | { ok: false; status: number; body: Record<string, unknown> };

export type GenerateImageParams<T> = {
  userId: string;
  isAdmin: boolean;
  // The visitor-facing prompt (what gets stored). The text sent to OpenAI adds
  // composition hints on top of it.
  prompt: string;
  creationType: CreationType;
  withFrame: boolean;
  referenceBuffer: Buffer | null;
  persist: (file: GeneratedImageFile) => Promise<T>;
  // "deliver" (default, what /api/generate-image has always done): if saving
  // fails the image is still returned and the slot stays spent.
  // "refund": saving is part of the deal — on failure give the slot back and
  // return an error.
  persistFailure?: "deliver" | "refund";
  deps: GenerationDeps;
};

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

export async function generateImageWithQuota<T>(
  params: GenerateImageParams<T>,
): Promise<ImageGenerationResult<T>> {
  const { userId, isAdmin, prompt, creationType, withFrame, referenceBuffer, deps } =
    params;
  const imageSize = creationType === "wall" ? "1024x1536" : "1024x1024";

  let quota: GenerationQuota | undefined;
  let consumedSource: QuotaSource | undefined;

  // A throw here (e.g. the database is down) is deliberately not caught: no slot
  // was claimed, so the caller's own error handling answers 500.
  if (!isAdmin) {
    const claim = await deps.tryConsumeGeneration(userId);

    if (!claim.allowed) {
      return {
        ok: false,
        status: 402,
        body: {
          error:
            "Votre compte gratuit est épuisé. Achetez un pack pour continuer.",
          requiresPayment: true,
          freeGenerationsRemaining: 0,
          paidCreditsRemaining: claim.quota.paidCredits,
          imagesGenerated: claim.quota.imagesGenerated,
        },
      };
    }

    quota = claim.quota;
    consumedSource = claim.source;
  }

  // Give the claimed slot back if the generation never produces an image.
  const refundIfConsumed = async () => {
    if (!isAdmin && consumedSource) {
      const source = consumedSource;
      consumedSource = undefined;
      await deps.refundGeneration(userId, source);
    }
  };

  const quotaPayload = (): QuotaPayload =>
    isAdmin
      ? { unlimited: true }
      : {
          freeGenerationsRemaining: quota?.freeRemaining ?? 0,
          paidCreditsRemaining: quota?.paidCredits ?? 0,
          imagesGenerated: quota?.imagesGenerated ?? 0,
        };

  try {
    const reinforcedPrompt = withFrame
      ? `${prompt}, zoomed out composition, the full outer frame must be completely visible with comfortable margin on every side, no cropped frame, no cut edges, no partial artwork, the artwork must fit naturally inside the image`
      : `${prompt}, centered composition, complete artwork fully visible, no cropped edges`;

    let imageBase64: string | undefined;

    if (referenceBuffer) {
      try {
        const edited = await deps.openai.images.edit({
          model: deps.model,
          image: await toFile(referenceBuffer, "reference.png", {
            type: "image/png",
          }),
          prompt: `${REFERENCE_PROMPT_PREFIX}${reinforcedPrompt}`,
          size: imageSize,
        });
        imageBase64 = edited.data?.[0]?.b64_json;
      } catch (editError) {
        await refundIfConsumed();

        if (isModerationRejection(editError)) {
          return {
            ok: false,
            status: 400,
            body: { error: MODERATION_ERROR_MESSAGE },
          };
        }

        // Keep OpenAI's internal message server-side only.
        console.error("OpenAI image edit failed:", editError);
        const status =
          typeof (editError as { status?: unknown })?.status === "number"
            ? (editError as { status: number }).status
            : 500;
        return {
          ok: false,
          status,
          body: { error: GENERATION_ERROR_MESSAGE },
        };
      }
    } else {
      const response = await deps.fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${deps.apiKey}`,
          },
          body: JSON.stringify({
            model: deps.model,
            prompt: reinforcedPrompt,
            size: imageSize,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        await refundIfConsumed();

        if (
          isModerationRejection({
            status: response.status,
            code: data?.error?.code,
            message: data?.error?.message,
          })
        ) {
          return {
            ok: false,
            status: 400,
            body: { error: MODERATION_ERROR_MESSAGE },
          };
        }

        // Keep OpenAI's internal message server-side only. No `error` text is
        // sent: the client falls back to its translated errors.generationFailed.
        console.error("OpenAI image generation failed:", response.status, data);
        return {
          ok: false,
          status: response.status,
          body: { errorCode: "generation_failed" },
        };
      }

      imageBase64 = data?.data?.[0]?.b64_json;
    }

    if (!imageBase64) {
      await refundIfConsumed();
      return {
        ok: false,
        status: 500,
        body: { error: "Aucune image générée." },
      };
    }

    const pngBuffer = Buffer.from(imageBase64, "base64");
    const webp = await sharp(pngBuffer).webp({ quality: 80 }).toBuffer();
    const dataUrl = `data:image/webp;base64,${webp.toString("base64")}`;
    let persisted: T | undefined;

    try {
      persisted = await params.persist({ dataUrl, webp });
    } catch (persistError) {
      console.error("Failed to persist generated image:", persistError);

      if (params.persistFailure === "refund") {
        await refundIfConsumed();
        return {
          ok: false,
          status: 500,
          body: { error: GENERATION_ERROR_MESSAGE },
        };
      }
    }

    return { ok: true, image: dataUrl, quota: quotaPayload(), persisted };
  } catch {
    await refundIfConsumed();

    return {
      ok: false,
      status: 500,
      body: { error: GENERATION_ERROR_MESSAGE },
    };
  }
}
