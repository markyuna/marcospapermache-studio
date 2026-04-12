import type { Metadata } from "next";
import {
  ArrowRight,
  Camera,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import ContactForm from "@/components/contact/ContactForm";
import ContactVisual from "@/components/contact/ContactVisual";
import { Container } from "@/components/layout/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  const requestTypes = [
    t("requestTypes.customOrder"),
    t("requestTypes.collaboration"),
    t("requestTypes.artworkQuestion"),
    t("requestTypes.decorativeProject"),
    t("requestTypes.professionalRequest"),
  ];

  const steps = [
    {
      title: t("steps.step1.title"),
      text: t("steps.step1.text"),
    },
    {
      title: t("steps.step2.title"),
      text: t("steps.step2.text"),
    },
    {
      title: t("steps.step3.title"),
      text: t("steps.step3.text"),
    },
    {
      title: t("steps.step4.title"),
      text: t("steps.step4.text"),
    },
  ];

  return (
    <main className="relative overflow-hidden bg-[#0a0a0a] py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#ff6a00]/7 blur-[150px]" />
        <div className="absolute right-[-120px] top-24 h-[320px] w-[320px] rounded-full bg-[#f3d288]/5 blur-[130px]" />
        <div className="absolute bottom-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-transparent blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <section className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
            <div className="space-y-6 md:space-y-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2">
                  <Sparkles className="h-4 w-4 text-[#ff6a00]" />
                  <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-300">
                    {t("badge")}
                  </span>
                </div>

                <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl md:mt-6 md:text-6xl md:leading-[1.02]">
                  {t("title.line1")}
                  <span className="block bg-gradient-to-r from-white via-[#f6d7bd] to-[#ff6a00] bg-clip-text text-transparent">
                    {t("title.line2")}
                  </span>
                </h1>
              </div>

              <div className="pt-1 md:pt-3">
                <ContactVisual mobile />
                <ContactVisual />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-transparent p-6 shadow-[0_20px_80px_rgba(0,0,0,0.38)] md:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
                {t("contactCard.eyebrow")}
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href="mailto:contact@marcospapermache.com"
                  className="group flex items-start gap-4 rounded-[1.4rem] border border-white/10 bg-black/25 p-4 transition duration-300 hover:border-[#ff6a00]/40 hover:bg-white/[0.06]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#ff6a00]">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {t("contactCard.email.title")}
                    </p>
                    <p className="mt-1 break-all text-sm text-neutral-400">
                      contact@marcospapermache.com
                    </p>
                  </div>

                  <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-[#ff6a00]" />
                </a>

                <a
                  href="https://www.instagram.com/marcospapermache"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-[1.4rem] border border-white/10 bg-black/25 p-4 transition duration-300 hover:border-[#ff6a00]/40 hover:bg-white/[0.06]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#ff6a00]">
                    <Camera className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {t("contactCard.instagram.title")}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      @marcospapermache
                    </p>
                  </div>

                  <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-neutral-500 transition group-hover:translate-x-1 group-hover:text-[#ff6a00]" />
                </a>
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#ff6a00]">
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-medium text-white">
                    {t("contactCard.form.title")}
                  </p>
                </div>

                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5">
                <p className="text-sm font-medium text-white">
                  {t("contactCard.requestTypesTitle")}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {requestTypes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-neutral-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-6xl md:mt-20">
          <div className="rounded-[2.2rem] border border-white/10  p-8 shadow-[0_30px_100px_rgba(0,0,0,0.38)] md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#c7a98b]">
                  {t("process.eyebrow")}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                  {t("process.title")}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="text-sm font-medium text-white">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}