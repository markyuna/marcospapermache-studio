// src/app/[locale]/connexion/page.tsx

import { getTranslations, setRequestLocale } from "next-intl/server";

import CustomerLoginForm from "@/components/account/CustomerLoginForm";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ConnexionPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "AccountPage.login" });

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#fffaf5,#fff7f1,#ffffff)] px-4 py-24 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-xl rounded-[32px] border border-neutral-200 bg-white/90 p-8 shadow-sm backdrop-blur md:p-10">
          <div className="mx-auto mb-8 max-w-md text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">
              {t("badge")}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {t("description")}
            </p>
          </div>

          <CustomerLoginForm />
        </section>
      </div>
    </main>
  );
}
