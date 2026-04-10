import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import CommandeForm from "@/components/forms/CommandeForm";

export default async function CommandePage() {
  const t = await getTranslations("CommandePage");

  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">
          {t("badge")}
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          {t("title")}
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-300">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-neutral-400">
          <span className="rounded-full border border-white/10 px-4 py-2">
            {t("highlights.fast")}
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            {t("highlights.custom")}
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">
            {t("highlights.noCommitment")}
          </span>
        </div>

        <div className="mt-12">
          <CommandeForm />
        </div>
      </Container>
    </section>
  );
}