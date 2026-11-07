import { ArrowUpRight, Sparkles, Wand2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import QuizResultDeleteButton from "@/components/account/QuizResultDeleteButton";
import { PROFILE_GRADIENTS } from "@/components/quiz/profile-gradients";
import { buildGeneratorQuery } from "@/data/quiz/generator-params";
import { PROFILES, isProfileId } from "@/data/quiz/profiles";
import { pickPromptKeys, seedFromCode } from "@/data/quiz/share";
import { Link } from "@/i18n/navigation";
import { MAX_QUIZ_RESULTS, type QuizResultDTO } from "@/lib/quiz-api";

type Props = {
  results: QuizResultDTO[];
};

const linkButton =
  "inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-paper-surface px-3 py-2 text-xs font-medium text-[#181512] no-underline transition hover:bg-paper-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c65400]/50";

// The saved quiz results of the signed-in user, with their private images
// (signed URLs created on the server for this page render only).
export default async function QuizResultsSection({ results }: Props) {
  const t = await getTranslations("quiz");
  const locale = await getLocale();
  const formatDate = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-paper-surface p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#b98f63]" />
          <h2 className="text-lg font-semibold text-[#181512]">
            {t("account.title")}
          </h2>
        </div>

        {results.length > 0 ? (
          <p className="text-xs text-neutral-500">
            {t("account.count", { count: results.length, max: MAX_QUIZ_RESULTS })}
          </p>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-neutral-500">{t("account.description")}</p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-[1.25rem] border border-neutral-200 bg-paper-base px-4 py-6 text-center">
          <p className="text-sm text-neutral-500">{t("account.empty")}</p>
          <Link
            href="/quiz"
            className="btn-gold-shimmer mt-3 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium no-underline transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            {t("account.emptyCta")}
          </Link>
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {results.map((result) => {
            const profileId = isProfileId(result.profile) ? result.profile : null;
            const profileName = profileId
              ? t(`profiles.${profileId}.name`)
              : result.profile;

            // Same prompt the result screen offers: the one that produced the
            // image, or the first of the two picked for this code.
            const profile = PROFILES.find((p) => p.id === profileId);
            const promptKey =
              result.promptKey ??
              (profile
                ? pickPromptKeys(profile.promptKeys, seedFromCode(result.code))[0]
                : null);
            const generatorHref =
              profileId && promptKey && result.config
                ? `/create?${buildGeneratorQuery(
                    t(`profiles.${profileId}.prompts.${promptKey}`),
                    result.config,
                  )}`
                : null;

            return (
              <li
                key={result.id}
                className="flex flex-col overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-paper-base"
              >
                <div className="relative aspect-square w-full">
                  {result.signedUrl ? (
                    // Short-lived signed URL from the private bucket: a plain <img>, no image optimizer in between
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.signedUrl}
                      alt={t("account.imageAlt", { profile: profileName })}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 flex items-end bg-gradient-to-br p-3 ${
                        profileId ? PROFILE_GRADIENTS[profileId] : "from-neutral-200 to-neutral-300"
                      }`}
                    >
                      <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-700">
                        {t("account.noImage")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#181512]">
                      {profileName}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {t("account.savedOn", {
                        date: formatDate.format(new Date(result.createdAt)),
                      })}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <Link href={`/quiz?r=${result.code}`} className={linkButton}>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {t("account.view")}
                    </Link>

                    {generatorHref ? (
                      <Link href={generatorHref} className={linkButton}>
                        <Wand2 className="h-3.5 w-3.5" />
                        {t("account.openGenerator")}
                      </Link>
                    ) : null}

                    <QuizResultDeleteButton id={result.id} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
