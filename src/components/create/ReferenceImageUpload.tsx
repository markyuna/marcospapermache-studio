"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { AlertCircle, ImagePlus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const MAX_SIDE = 1024;
const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;
const JPEG_QUALITIES = [0.85, 0.75, 0.65];
const MAX_OUTPUT_BYTES = 3.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ReferenceErrorKey = "badType" | "tooLarge" | "unreadable";

class ReferenceError extends Error {
  constructor(readonly key: ReferenceErrorKey) {
    super(key);
  }
}

type Decoded = {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

async function decodeImage(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // Fall through to the <img> decoder (e.g. Safari decoding a HEIC).
    }
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("decode"));
      img.src = objectUrl;
    });

    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(objectUrl),
    };
  } catch {
    URL.revokeObjectURL(objectUrl);
    const typeAllowed = ALLOWED_TYPES.includes(file.type);
    throw new ReferenceError(typeAllowed ? "unreadable" : "badType");
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
}

async function normalizeReference(file: File): Promise<File> {
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new ReferenceError("tooLarge");
  }

  const decoded = await decodeImage(file);

  try {
    if (!decoded.width || !decoded.height) {
      throw new ReferenceError("unreadable");
    }

    const scale = Math.min(1, MAX_SIDE / Math.max(decoded.width, decoded.height));
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new ReferenceError("unreadable");
    }

    // White backdrop so transparent PNGs don't turn black in the JPEG.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(decoded.source, 0, 0, width, height);

    for (const quality of JPEG_QUALITIES) {
      const blob = await canvasToJpeg(canvas, quality);

      if (!blob) {
        throw new ReferenceError("unreadable");
      }

      if (blob.size <= MAX_OUTPUT_BYTES) {
        return new File([blob], "reference.jpg", { type: "image/jpeg" });
      }
    }

    throw new ReferenceError("tooLarge");
  } finally {
    decoded.release();
  }
}

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

export default function ReferenceImageUpload({
  value,
  onChange,
  disabled = false,
}: Props) {
  const t = useTranslations("AIExperience.reference");
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const hintId = `${baseId}-hint`;

  // The preview URL is created together with the file (not in an effect) and
  // is only shown while it still belongs to the current `value`.
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorKey, setErrorKey] = useState<ReferenceErrorKey | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const previewUrl = value && preview?.file === value ? preview.url : null;

  function replacePreview(next: { file: File; url: string } | null) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = next?.url ?? null;
    setPreview(next);
  }

  // Parent reset (value -> null): clear the native input too.
  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    [],
  );

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    // Reset so picking the same file again still fires a change event.
    input.value = "";

    if (!file) return;

    setErrorKey(null);
    setIsProcessing(true);

    try {
      const normalized = await normalizeReference(file);
      replacePreview({ file: normalized, url: URL.createObjectURL(normalized) });
      onChange(normalized);
    } catch (err) {
      setErrorKey(err instanceof ReferenceError ? err.key : "unreadable");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleRemove() {
    setErrorKey(null);
    replacePreview(null);
    onChange(null);
  }

  const isBusy = disabled || isProcessing;

  return (
    <div className="mt-5">
      <p id={labelId} className="text-sm font-medium text-neutral-200">
        {t("title")}
      </p>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isBusy}
      />

      {previewUrl ? (
        <div className="mt-3 flex min-h-[56px] items-center gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={t("previewAlt")}
            className="h-16 w-16 shrink-0 rounded-[1rem] border border-white/10 object-cover"
          />

          <div className="min-w-0 flex-1">
            <p id={hintId} className="text-xs leading-5 text-neutral-500">
              {t("hint")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isBusy}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-sm text-neutral-300 transition duration-300 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("remove")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isBusy}
          aria-labelledby={labelId}
          aria-describedby={hintId}
          className="mt-3 flex min-h-[56px] w-full items-center gap-3 rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 px-4 py-3 text-left outline-none transition duration-300 hover:bg-black/25 focus:border-[#caa27c] focus:ring-2 focus:ring-[#caa27c]/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isProcessing ? (
            <Loader2
              className="h-5 w-5 shrink-0 animate-spin text-[#e3bf9d]"
              aria-hidden="true"
            />
          ) : (
            <ImagePlus
              className="h-5 w-5 shrink-0 text-[#e3bf9d]"
              aria-hidden="true"
            />
          )}

          <span className="min-w-0">
            <span className="block text-sm font-medium text-white">
              {isProcessing ? t("processing") : t("choose")}
            </span>
            <span
              id={hintId}
              className="mt-0.5 block text-xs leading-5 text-neutral-500"
            >
              {t("hint")}
            </span>
          </span>
        </button>
      )}

      {isProcessing && value ? (
        <p className="mt-2 text-xs text-neutral-400" role="status">
          {t("processing")}
        </p>
      ) : null}

      {errorKey ? (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-[1.25rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t(`errors.${errorKey}`)}
        </p>
      ) : null}
    </div>
  );
}
