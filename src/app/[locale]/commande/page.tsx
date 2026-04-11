import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import CommandeForm from "@/components/forms/CommandeForm";

type CommandePageProps = {
  searchParams: Promise<{
    prompt?: string;
  }>;
};

export default async function CommandePage({
  searchParams,
}: CommandePageProps) {
  const t = await getTranslations("CommandePage");
  const { prompt = "" } = await searchParams;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f4eadf_0%,#f7efe7_24%,#fbf7f2_58%,#f8f1e8_100%)] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,164,124,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(205,164,124,0.08),transparent_30%)]" />

      <Container className="relative max-w-6xl">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9c7b4] bg-white/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.32em] text-[#8f7762] shadow-[0_8px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
            {t("badge")}
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[#181512] md:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#6f6257] md:text-xl">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-[#dfcfbf] bg-white/65 px-4 py-2 text-[#6b5f55] shadow-[0_10px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
              {t("highlights.fast")}
            </span>
            <span className="rounded-full border border-[#dfcfbf] bg-white/65 px-4 py-2 text-[#6b5f55] shadow-[0_10px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
              {t("highlights.custom")}
            </span>
            <span className="rounded-full border border-[#dfcfbf] bg-white/65 px-4 py-2 text-[#6b5f55] shadow-[0_10px_30px_rgba(24,21,18,0.04)] backdrop-blur-sm">
              {t("highlights.noCommitment")}
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <CommandeForm defaultPrompt={prompt} />
        </div>
      </Container>
    </section>
  );
}