"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type CommandeFormProps = {
  defaultPrompt?: string;
  defaultImage?: string;
};

export default function CommandeForm({
  defaultPrompt = "",
  defaultImage = "",
}: CommandeFormProps) {
  const t = useTranslations("CommandeForm");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState(defaultPrompt);

  const [generatedImage, setGeneratedImage] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return defaultImage || null;
    }

    return sessionStorage.getItem("generatedImage") || defaultImage || null;
  });

  useEffect(() => {
    setMessage(defaultPrompt);
  }, [defaultPrompt]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (generatedImage) {
      formData.set("generatedImage", generatedImage);
    }

    try {
      const response = await fetch("/api/commandes", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(t("errors.invalidResponse"));
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("errors.generic"));
      }

      form.reset();

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      sessionStorage.removeItem("generatedImage");

      setImagePreview(null);
      setGeneratedImage(null);
      setMessage("");
      setSuccess(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.generic"),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function handleRemoveImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveGeneratedImage() {
    setGeneratedImage(null);
    sessionStorage.removeItem("generatedImage");
  }

  if (success) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white/70 p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <h3 className="text-2xl font-medium text-[#181512]">
          {t("success.title")}
        </h3>
        <p className="mt-4 text-[#5f5348]">{t("success.description")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-sm"
    >
      {generatedImage ? (
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8a7667]">
                Concept IA
              </p>
              <p className="mt-2 text-sm text-[#5f5348]">
                Cette image générée sert de base visuelle pour votre demande sur
                mesure.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveGeneratedImage}
              className="shrink-0 rounded-full border border-[#e7d5c5] bg-white px-4 py-2 text-xs font-medium text-[#181512] transition hover:bg-[#f8f4ef]"
            >
              {t("actions.remove")}
            </button>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-[#e7d5c5] bg-white">
            <div className="relative aspect-[4/5] w-full max-w-md">
              <Image
                src={generatedImage}
                alt="Concept généré avec l’intelligence artificielle"
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>

          <input type="hidden" name="generatedImage" value={generatedImage} />
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <input
          name="name"
          placeholder={t("fields.name")}
          aria-label={t("fields.name")}
          required
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />

        <input
          name="email"
          type="email"
          placeholder={t("fields.email")}
          aria-label={t("fields.email")}
          required
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input
          name="projectType"
          placeholder={t("fields.projectType")}
          aria-label={t("fields.projectType")}
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />

        <input
          name="dimensions"
          placeholder={t("fields.dimensions")}
          aria-label={t("fields.dimensions")}
          className="rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6">
        <input
          name="budget"
          placeholder={t("fields.budget")}
          aria-label={t("fields.budget")}
          className="w-full rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6">
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("fields.message")}
          aria-label={t("fields.message")}
          rows={5}
          required
          className="w-full rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#181512] outline-none transition focus:border-[#ff6a00]"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-[#5f5348]">
          {t("fields.referenceImage")}
        </label>

        <input
          ref={fileInputRef}
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="block w-full rounded-xl border border-[#e7d5c5] bg-white px-4 py-3 text-sm text-[#5f5348] file:mr-4 file:rounded-full file:border-0 file:bg-[#181512] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />

        {imagePreview ? (
          <div className="relative mt-4 overflow-hidden rounded-xl border border-[#e7d5c5] bg-white">
            <div className="relative h-64 w-full">
              <Image
                src={imagePreview}
                alt={t("fields.imagePreviewAlt")}
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md transition hover:bg-black/80"
            >
              {t("actions.remove")}
            </button>
          </div>
        ) : null}

        <p className="mt-2 text-xs text-[#8a7667]">{t("fields.imageHint")}</p>
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#181512] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("actions.sending") : t("actions.submit")}
      </button>
    </form>
  );
}