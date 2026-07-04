import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Sparkles, PackageSearch, ImageIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  getCommandeStatusClasses,
  getCommandeStatusLabel,
} from "@/lib/commandes-status";
import type { Commande } from "@/types/commande";
import type { GeneratedImage } from "@/generated/prisma/client/client";
import BuyCreditsButton from "@/components/account/BuyCreditsButton";
import LogoutButton from "@/components/account/LogoutButton";

type Props = {
  email: string;
  paidCredits: number;
  generatedImages: GeneratedImage[];
  commandes: Commande[];
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

export default async function AccountDashboard({
  email,
  paidCredits,
  generatedImages,
  commandes,
}: Props) {
  const t = await getTranslations("AccountPage.dashboard");

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
      <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
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
                {t("creditsCount", { count: paidCredits })}
              </p>
            </div>
          </div>

          <BuyCreditsButton />
        </div>
      </section>

      {/* Generated images section */}
      <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-[#b98f63]" />
          <h2 className="text-lg font-semibold text-[#181512]">
            {t("imagesTitle")}
          </h2>
        </div>

        {generatedImages.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{t("imagesEmpty")}</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-neutral-50"
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

                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 p-3 backdrop-blur-sm transition duration-300 group-hover:translate-y-0">
                  <Link
                    href={{
                      pathname: "/commande",
                      query: {
                        prompt: image.prompt,
                        sourceAiImageId: image.id,
                      },
                    }}
                    className="block w-full rounded-full bg-white px-3 py-2 text-center text-xs font-medium text-[#181512] transition hover:bg-neutral-100"
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
      <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2">
          <PackageSearch className="h-5 w-5 text-[#b98f63]" />
          <h2 className="text-lg font-semibold text-[#181512]">
            {t("ordersTitle")}
          </h2>
        </div>

        {commandes.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">{t("ordersEmpty")}</p>
        ) : (
          <div className="mt-5 space-y-3">
            {commandes.map((commande) => (
              <div
                key={commande.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-neutral-200 bg-neutral-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#181512]">
                    {commande.project_type || t("ordersFallbackTitle")}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {formatDate(commande.created_at)}
                  </p>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium ${getCommandeStatusClasses(commande.status)}`}
                >
                  {getCommandeStatusLabel(commande.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
