import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Sparkles, PackageSearch, ImageIcon, UserCog } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  getCommandeStatusClasses,
  getCommandeStatusLabel,
} from "@/lib/commandes-status";
import type { Commande } from "@/types/commande";
import type { GeneratedImage, UserProfile } from "@/generated/prisma/client/client";
import BuyCreditsButton from "@/components/account/BuyCreditsButton";
import LogoutButton from "@/components/account/LogoutButton";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

type Props = {
  email: string;
  paidCredits: number;
  generatedImages: GeneratedImage[];
  commandes: Commande[];
  profile: UserProfile | null;
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
  "rounded-[2rem] border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_30px_120px_rgba(0,0,0,0.28)] md:p-8";

export default async function AccountDashboard({
  email,
  paidCredits,
  generatedImages,
  commandes,
  profile,
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
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9b08c]/30 bg-[#d9b08c]/15">
              <Sparkles className="h-5 w-5 text-[#e3bf9d]" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">
                {t("creditsLabel")}
              </p>
              <p className="text-2xl font-semibold text-white">
                {t("creditsCount", { count: paidCredits })}
              </p>
            </div>
          </div>

          <BuyCreditsButton />
        </div>
      </section>

      {/* Generated images section */}
      <section className={cardClassName}>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-[#e3bf9d]" />
          <h2 className="text-lg font-semibold text-white">
            {t("imagesTitle")}
          </h2>
        </div>

        {generatedImages.length === 0 ? (
          <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
            <p className="text-sm text-neutral-400">{t("imagesEmpty")}</p>
            <Link
              href="/create"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#d9b08c] px-5 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-[#e5c4a6]"
            >
              <Sparkles className="h-4 w-4" />
              {t("imagesEmptyCta")}
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.prompt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 p-3 backdrop-blur-sm transition duration-300 group-hover:translate-y-0">
                  <Link
                    href={{
                      pathname: "/commande",
                      query: {
                        prompt: image.prompt,
                        sourceAiImageId: image.id,
                      },
                    }}
                    className="block w-full rounded-full bg-[#d9b08c] px-3 py-2 text-center text-xs font-medium text-black transition hover:bg-[#e5c4a6]"
                  >
                    {t("orderThisSculpture")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders section */}
      <section className={cardClassName}>
        <div className="flex items-center gap-2">
          <PackageSearch className="h-5 w-5 text-[#e3bf9d]" />
          <h2 className="text-lg font-semibold text-white">
            {t("ordersTitle")}
          </h2>
        </div>

        {commandes.length === 0 ? (
          <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
            <p className="text-sm text-neutral-400">{t("ordersEmpty")}</p>
            <Link
              href="/creations-sur-mesure"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-white/[0.09]"
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
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {sourceImage ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={sourceImage.imageUrl}
                          alt={sourceImage.prompt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
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
          <UserCog className="h-5 w-5 text-[#e3bf9d]" />
          <h2 className="text-lg font-semibold text-white">
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

        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
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
