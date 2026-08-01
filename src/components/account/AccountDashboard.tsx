import { getTranslations } from "next-intl/server";
import { Sparkles, Wand2, PackageSearch, ImageIcon, UserCog } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  getCommandeStatusClasses,
  getCommandeStatusLabel,
} from "@/lib/commandes-status";
import type { Commande } from "@/types/commande";
import type { GeneratedImage, UserProfile } from "@/generated/prisma/client/client";
import BuyCreditsButton from "@/components/account/BuyCreditsButton";
import GeneratedImagesGallery from "@/components/account/GeneratedImagesGallery";
import LogoutButton from "@/components/account/LogoutButton";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

type Props = {
  email: string;
  paidCredits: number;
  generatedImages: GeneratedImage[];
  commandes: Commande[];
  profile: UserProfile | null;
  isAdmin: boolean;
};

function formatDate(date: Date | string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}

const cardClassName =
  "rounded-[2rem] border border-neutral-200 bg-paper-surface p-6 shadow-sm md:p-8";

export default async function AccountDashboard({
  email,
  paidCredits,
  generatedImages,
  commandes,
  profile,
  isAdmin,
}: Props) {
  const t = await getTranslations("AccountPage.dashboard");

  const imageById = new Map(generatedImages.map((image) => [image.id, image]));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
            {t("badge")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#181512] md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{email}</p>
        </div>

        <LogoutButton />
      </div>

      {/* Credits section */}
      <section className={cardClassName}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e1d2c4] bg-[#fcf8f3]">
              <Sparkles className="h-5 w-5 text-[#b98f63]" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">
                {t("creditsLabel")}
              </p>
              <p className="text-2xl font-semibold text-[#181512]">
                {isAdmin ? `∞ ${t("creditsUnlimited")}` : t("creditsCount", { count: paidCredits })}
              </p>
            </div>
          </div>

          {isAdmin ? null : <BuyCreditsButton />}
        </div>

        <div className="mt-4 border-t border-neutral-100 pt-4">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full border border-[#e1d2c4] bg-[#fcf8f3] px-4 py-2.5 text-sm font-medium text-[#8a6a3f] no-underline transition duration-300 hover:bg-[#f8f1e8] hover:text-[#6b5330]"
          >
            <Wand2 className="h-4 w-4" />
            {t("goToAiExperience")}
          </Link>
        </div>
      </section>

      {/* Generated images section */}
      <section className={cardClassName}>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-[#b98f63]" />
          <h2 className="text-lg font-semibold text-[#181512]">
            {t("imagesTitle")}
          </h2>
        </div>

        {generatedImages.length === 0 ? (
          <div className="mt-4 rounded-[1.25rem] border border-neutral-200 bg-paper-base px-4 py-6 text-center">
            <p className="text-sm text-neutral-500">{t("imagesEmpty")}</p>
            <Link
              href="/create"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light px-5 py-2.5 text-sm font-medium text-white no-underline shadow-[0_18px_40px_rgba(185,106,47,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(185,106,47,0.38)]"
            >
              <Sparkles className="h-4 w-4" />
              {t("imagesEmptyCta")}
            </Link>
          </div>
        ) : (
          <GeneratedImagesGallery images={generatedImages} />
        )}
      </section>

      {/* Orders section */}
      <section className={cardClassName}>
        <div className="flex items-center gap-2">
          <PackageSearch className="h-5 w-5 text-[#b98f63]" />
          <h2 className="text-lg font-semibold text-[#181512]">
            {t("ordersTitle")}
          </h2>
        </div>

        {commandes.length === 0 ? (
          <div className="mt-4 rounded-[1.25rem] border border-neutral-200 bg-paper-base px-4 py-6 text-center">
            <p className="text-sm text-neutral-500">{t("ordersEmpty")}</p>
            <Link
              href="/creations-sur-mesure"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-paper-surface px-5 py-2.5 text-sm font-medium text-[#181512] transition duration-300 hover:bg-paper-base"
            >
              {t("ordersEmptyCta")}
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {commandes.map((commande) => {
              const sourceImage = commande.source_ai_image_id
                ? imageById.get(commande.source_ai_image_id)
                : undefined;

              return (
                <div
                  key={commande.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-neutral-200 bg-paper-base px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {sourceImage ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200">
                        {/* Already-WebP Supabase Storage thumbnail at a fixed 48px size — native <img> skips Vercel Image Optimization entirely */}
                        <img
                          src={sourceImage.imageUrl}
                          alt={sourceImage.prompt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#181512]">
                        {commande.project_type || t("ordersFallbackTitle")}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {formatDate(commande.created_at)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium ${getCommandeStatusClasses(commande.status)}`}
                  >
                    {getCommandeStatusLabel(commande.status)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Profile section */}
      <section className={cardClassName}>
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-[#b98f63]" />
          <h2 className="text-lg font-semibold text-[#181512]">
            {t("profileTitle")}
          </h2>
        </div>

        <div className="mt-5">
          <ProfileForm
            email={email}
            initialFullName={profile?.fullName ?? ""}
            initialAddress={profile?.address ?? ""}
            initialCity={profile?.city ?? ""}
            initialPostalCode={profile?.postalCode ?? ""}
            initialCountry={profile?.country ?? ""}
            initialPhone={profile?.phone ?? ""}
          />
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {t("passwordTitle")}
          </h3>
          <div className="mt-4">
            <PasswordChangeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
