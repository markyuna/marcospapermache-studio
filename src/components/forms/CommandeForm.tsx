"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Trash2,
  AlertCircle,
} from "lucide-react";

type CommandeFormProps = {
  defaultPrompt?: string;
  defaultImage?: string;
};

type ConfettiPiece = {
  id: number;
  left: string;
  width: number;
  height: number;
  rotate: number;
  duration: number;
  delay: number;
  opacity: number;
};

export default function CommandeForm({
  defaultPrompt = "",
  defaultImage = "",
}: CommandeFormProps) {
  const t = useTranslations("CommandeForm");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const successCardRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState(defaultPrompt);
  const [generatedImage, setGeneratedImage] = useState<string | null>(
    defaultImage || null,
  );

  useEffect(() => {
    setMessage(defaultPrompt);
  }, [defaultPrompt]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedImage = sessionStorage.getItem("generatedImage");

    if (storedImage) {
      setGeneratedImage(storedImage);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!showSuccessToast) return;

    const timeout = window.setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [showSuccessToast]);

  useEffect(() => {
    if (!success || !successCardRef.current || typeof window === "undefined") {
      return;
    }

    const scrollToSuccessCard = () => {
      const element = successCardRef.current;
      if (!element) return;

      const mobileOffset = 24;
      const desktopOffset = 40;
      const offset = window.innerWidth < 768 ? mobileOffset : desktopOffset;

      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      element.focus({ preventScroll: true });
    };

    const frame = window.requestAnimationFrame(scrollToSuccessCard);
    const timeout = window.setTimeout(scrollToSuccessCard, 220);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [success]);

  useEffect(() => {
    if (!success || typeof window === "undefined") return;

    playSuccessSound();

    if ("vibrate" in navigator) {
      navigator.vibrate?.([80, 40, 120]);
    }
  }, [success]);

  const confettiPieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${6 + index * 5.2}%`,
        width: index % 3 === 0 ? 8 : 6,
        height: index % 2 === 0 ? 18 : 14,
        rotate: (index % 2 === 0 ? 1 : -1) * (12 + index * 7),
        duration: 1.8 + (index % 5) * 0.18,
        delay: index * 0.035,
        opacity: 0.55 + (index % 4) * 0.08,
      })),
    [],
  );

  function playSuccessSound() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        // @ts-expect-error Safari legacy support
        window.webkitAudioContext;

      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const now = audioContext.currentTime;

      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.connect(audioContext.destination);

      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const osc3 = audioContext.createOscillator();

      osc1.type = "sine";
      osc2.type = "triangle";
      osc3.type = "sine";

      osc1.frequency.setValueAtTime(740, now);
      osc2.frequency.setValueAtTime(1110, now + 0.06);
      osc3.frequency.setValueAtTime(1480, now + 0.12);

      masterGain.gain.exponentialRampToValueAtTime(0.035, now + 0.03);
      masterGain.gain.exponentialRampToValueAtTime(0.02, now + 0.16);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc3.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.18);

      osc2.start(now + 0.07);
      osc2.stop(now + 0.28);

      osc3.start(now + 0.14);
      osc3.stop(now + 0.42);

      window.setTimeout(() => {
        void audioContext.close();
      }, 900);
    } catch {
      // ignore audio failures silently
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");
    setShowSuccessToast(false);

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

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("generatedImage");
      }

      setImagePreview(null);
      setGeneratedImage(null);
      setMessage("");
      setSuccess(true);
      setShowSuccessToast(true);
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

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("generatedImage");
    }
  }

  const inputClassName =
    "w-full rounded-[1rem] border border-[#e4d6c8] bg-white px-4 py-3.5 text-sm text-[#181512] outline-none transition duration-200 placeholder:text-[#9a8a7d] focus:border-[#cfa57f] focus:ring-4 focus:ring-[#cfa57f]/10";

  const labelClassName = "mb-2 block text-sm font-medium text-[#5f5348]";

  if (success) {
    return (
      <motion.div
        ref={successCardRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 30, scale: 0.965 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-[#e8d9ca] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f1e8_100%)] p-10 text-center shadow-[0_20px_60px_rgba(24,21,18,0.06)] outline-none"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(207,165,127,0.16),transparent_58%)]"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.span
              key={piece.id}
              initial={{ y: -30, opacity: 0, rotate: 0 }}
              animate={{
                y: 180,
                opacity: [0, piece.opacity, piece.opacity, 0],
                rotate: piece.rotate,
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeOut",
              }}
              className="absolute top-0 rounded-full"
              style={{
                left: piece.left,
                width: piece.width,
                height: piece.height,
                background:
                  piece.id % 3 === 0
                    ? "rgba(207,165,127,0.95)"
                    : piece.id % 3 === 1
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(232,217,202,0.95)",
                boxShadow: "0 4px 12px rgba(24,21,18,0.08)",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.86, 1.04, 1],
            opacity: 1,
          }}
          transition={{ delay: 0.14, duration: 0.55 }}
          className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e7d5c5] bg-white text-[#181512] shadow-[0_10px_30px_rgba(24,21,18,0.05)]"
        >
          <motion.div
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-[#e6d4c3]"
          />
          <CheckCircle2 className="relative z-10 h-8 w-8" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="relative mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#181512]"
        >
          {t("success.title")} ✨
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.45 }}
          className="relative mx-auto mt-4 max-w-2xl text-base leading-8 text-[#6b5f55]"
        >
          {t("success.description")}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[#e7dbcf] bg-white/80 p-6 shadow-[0_18px_50px_rgba(24,21,18,0.04)] backdrop-blur-sm md:p-8"
    >
      {showSuccessToast ? (
        <div className="mb-6 flex items-start gap-3 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">{t("success.title")}</p>
            <p className="mt-1 text-emerald-700/90">
              {t("success.description")}
            </p>
          </div>
        </div>
      ) : null}

      {generatedImage ? (
        <div className="mb-8 border-b border-[#eee3d8] pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d8ca] bg-[#fcf8f3] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#8a7667]">
                <Sparkles className="h-3.5 w-3.5" />
                {t("generatedConcept.badge")}
              </div>

              <p className="mt-4 text-sm leading-7 text-[#5f5348]">
                {t("generatedConcept.description")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveGeneratedImage}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#e1d2c4] bg-white px-4 py-2 text-xs font-medium text-[#181512] transition hover:bg-[#f8f4ef]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("generatedConcept.remove")}
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[#e5d8cb] bg-white">
            <div className="relative aspect-[4/5] w-full max-w-md">
              <Image
                src={generatedImage}
                alt={t("generatedConcept.imageAlt")}
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
        <div>
          <label htmlFor="commande-name" className={labelClassName}>
            {t("fields.name")}
          </label>
          <input
            id="commande-name"
            name="name"
            placeholder={t("fields.name")}
            aria-label={t("fields.name")}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="commande-email" className={labelClassName}>
            {t("fields.email")}
          </label>
          <input
            id="commande-email"
            name="email"
            type="email"
            placeholder={t("fields.email")}
            aria-label={t("fields.email")}
            required
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="commande-project-type" className={labelClassName}>
            {t("fields.projectType")}
          </label>
          <input
            id="commande-project-type"
            name="projectType"
            placeholder={t("fields.projectType")}
            aria-label={t("fields.projectType")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="commande-dimensions" className={labelClassName}>
            {t("fields.dimensions")}
          </label>
          <input
            id="commande-dimensions"
            name="dimensions"
            placeholder={t("fields.dimensions")}
            aria-label={t("fields.dimensions")}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="commande-budget" className={labelClassName}>
          {t("fields.budget")}
        </label>
        <input
          id="commande-budget"
          name="budget"
          placeholder={t("fields.budget")}
          aria-label={t("fields.budget")}
          className={inputClassName}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="commande-message" className={labelClassName}>
          {t("fields.message")}
        </label>
        <textarea
          id="commande-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("fields.message")}
          aria-label={t("fields.message")}
          rows={6}
          required
          className={`${inputClassName} min-h-[170px] resize-y leading-7`}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="commande-image" className={labelClassName}>
          {t("fields.referenceImage")}
        </label>

        <input
          id="commande-image"
          ref={fileInputRef}
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="block w-full rounded-[1rem] border border-[#e4d6c8] bg-white px-4 py-3 text-sm text-[#5f5348] file:mr-4 file:rounded-full file:border-0 file:bg-[#181512] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />

        <p className="mt-2 text-xs text-[#8a7667]">{t("fields.imageHint")}</p>

        {imagePreview ? (
          <div className="relative mt-4 overflow-hidden rounded-[1.25rem] border border-[#e5d8cb] bg-white">
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
              className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md transition hover:bg-black/80"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("actions.remove")}
            </button>
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="mt-6 flex items-start gap-3 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#181512] px-6 py-3.5 text-sm font-medium text-white transition duration-300 hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("actions.sending")}
            </>
          ) : (
            t("actions.submit")
          )}
        </button>
      </div>
    </form>
  );
}