"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Copy, Check, Sparkles, X } from "lucide-react";

import { Container } from "@/components/layout/container";

export function CtaSection() {
  const t = useTranslations("CTA");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const examplePrompt = useMemo(() => t("promptModal.examplePrompt"), [t]);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setCopied(false);
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(examplePrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error("Unable to copy prompt:", error);
    }
  }

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isModalOpen) {
      body.style.overflow = "hidden";
      body.dataset.lightboxOpen = "true";
      html.dataset.lightboxOpen = "true";
    } else {
      body.style.overflow = "";
      delete body.dataset.lightboxOpen;
      delete html.dataset.lightboxOpen;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setCopied(false);
      }
    }

    if (isModalOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      body.style.overflow = "";
      delete body.dataset.lightboxOpen;
      delete html.dataset.lightboxOpen;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  return (
    <>
      <section className="pb-24 pt-10 md:pb-32 md:pt-12">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-[linear-gradient(135deg,#f8f1ea_0%,#f2e8dc_45%,#eadccf_100%)] shadow-[0_35px_120px_rgba(35,25,15,0.10)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.65),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,140,60,0.08),transparent_30%)]" />

            <div className="relative grid items-center gap-12 px-8 py-10 md:px-12 md:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-16 lg:py-16">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.34em] text-[#a0704d]">
                  {t("badge")}
                </p>

                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#171311] md:text-5xl lg:text-6xl">
                  {t("title")}
                </h2>

                <p className="mt-7 max-w-xl text-[15px] leading-8 text-[#5f5348] md:text-base">
                  {t("description")}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#6f5b4c] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t("promptCta")}
                  </button>

                  <span className="text-sm text-[#7b6d61]">
                    {t("promptHelper")}
                  </span>
                </div>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href="/create"
                    className="inline-flex items-center justify-center rounded-full bg-[#ff6a00] px-6 py-3.5 text-sm font-medium text-white shadow-[0_14px_34px_rgba(255,106,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#eb6100]"
                  >
                    {t("ctaPrimary")}
                  </Link>

                  <Link
                    href="/commande"
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 py-3.5 text-sm font-medium text-[#181512] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    {t("ctaSecondary")}
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-x-[8%] top-[6%] h-[82%] rounded-[2rem] bg-black/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-[#efe4d8] shadow-[0_30px_80px_rgba(0,0,0,0.16)]">
                  <div className="absolute left-4 top-4 z-10 rounded-full border border-white/60 bg-white/78 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#6f5b4c] backdrop-blur-md">
                    {t("imageBadge")}
                  </div>

                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/Harmonie-naturelle.png"
                      alt={t("imageAlt")}
                      fill
                      priority
                      className="object-cover object-center transition duration-700 hover:scale-[1.03]"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#efe4d8]/88 via-[#efe4d8]/42 to-transparent" />
                </div>

                <div className="absolute -left-4 bottom-6 hidden max-w-[240px] rounded-[1.4rem] border border-white/60 bg-white/72 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.10)] backdrop-blur-md md:block">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a6b47]">
                    {t("floatingCard.badge")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#3f372f]">
                    {t("floatingCard.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-[120] overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm md:px-6 md:py-10"
          onClick={closeModal}
        >
          <div className="flex min-h-full items-start justify-center md:pt-20">
            <div
              className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(180deg,#f7efe7_0%,#efe2d5_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.22)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cta-prompt-modal-title"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,106,0,0.08),transparent_30%)]" />

              <div className="relative border-b border-black/6 px-6 py-5 md:px-8">
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label={t("promptModal.closeAriaLabel")}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/70 text-[#4d4035] transition hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <p className="pr-14 text-xs uppercase tracking-[0.32em] text-[#a0704d]">
                  {t("promptModal.badge")}
                </p>

                <h3
                  id="cta-prompt-modal-title"
                  className="mt-3 max-w-2xl pr-10 text-2xl font-semibold tracking-[-0.03em] text-[#171311] md:text-3xl"
                >
                  {t("promptModal.title")}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f5348] md:text-base">
                  {t("promptModal.description")}
                </p>
              </div>

              <div className="relative px-6 py-6 md:px-8 md:py-8">
                <div className="rounded-[1.6rem] border border-black/8 bg-white/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm md:p-6">
                  <p className="text-sm leading-8 text-[#2c241e] md:text-[15px]">
                    {examplePrompt}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171311] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        {t("promptModal.copySuccess")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {t("promptModal.copy")}
                      </>
                    )}
                  </button>

                  <Link
                    href="/create"
                    className="inline-flex items-center justify-center rounded-full bg-[#ff6a00] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_34px_rgba(255,106,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#eb6100]"
                  >
                    {t("promptModal.createCta")}
                  </Link>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium text-[#181512] transition duration-300 hover:bg-white"
                  >
                    {t("promptModal.close")}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.2rem] border border-black/6 bg-white/45 px-4 py-3 text-sm leading-6 text-[#67594f]">
                  {t("promptModal.tip")}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}