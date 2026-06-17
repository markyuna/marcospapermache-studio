// src/app/[locale]/artiste-papier-mache/page.tsx

import type { Metadata } from "next";
import { ArrowRight, Brush, Gem, HandHeart, Recycle } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import JsonLd from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createMetadata, getAbsoluteUrl, siteConfig } from "@/lib/seo";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

const pageContent = {
  fr: {
    seoTitle: "Artiste papier mâché en France",
    seoDescription:
      "Découvrez l’univers de Marcos Suarez, artiste sculpteur en papier mâché, créateur de sculptures contemporaines, œuvres murales et pièces sur mesure façonnées à la main.",
    badge: "Artiste papier mâché",
    title: "Un artiste papier mâché entre matière, émotion et sculpture contemporaine.",
    description:
      "Marcos Suarez développe un univers sculptural où le papier mâché devient matière vivante. Chaque œuvre est façonnée à la main avec une attention particulière portée aux volumes, aux textures, à la lumière et à la présence de la pièce dans l’espace.",
    primaryCta: "Découvrir les sculptures",
    secondaryCta: "Commander une création",
    introEyebrow: "Une pratique artisanale et contemporaine",
    introTitle: "Transformer le papier en présence sculpturale.",
    introText:
      "Le papier mâché permet de créer des œuvres légères, expressives et profondément texturées. Dans l’atelier, le papier, le carton et les matières recyclées sont transformés en sculptures murales, objets d’art, luminaires sculpturaux ou pièces décoratives uniques.",
    blocks: [
      {
        title: "Sculptures uniques",
        text: "Chaque création est pensée comme une pièce singulière, avec ses reliefs, ses imperfections sensibles et son identité propre.",
      },
      {
        title: "Matières recyclées",
        text: "Le papier, le carton et les matériaux réutilisés deviennent une base artistique pour donner naissance à des formes nouvelles.",
      },
      {
        title: "Création sur mesure",
        text: "Une œuvre peut être imaginée à partir d’un souvenir, d’un lieu, d’un portrait, d’un objet symbolique ou d’une intention décorative.",
      },
      {
        title: "Univers contemporain",
        text: "L’approche mêle geste artisanal, recherche de forme, textures organiques et esthétique contemporaine.",
      },
    ],
    processEyebrow: "Pourquoi choisir le papier mâché ?",
    processTitle: "Une matière expressive, durable et profondément artisanale.",
    processText:
      "Le papier mâché offre une liberté rare : il permet de modeler des formes organiques, de créer du relief, d’intégrer la lumière et de donner une présence très personnelle à chaque sculpture. Cette matière humble devient un langage artistique capable de transformer un intérieur.",
    finalTitle: "Vous cherchez une sculpture en papier mâché sur mesure ?",
    finalDescription:
      "Vous pouvez découvrir les œuvres existantes ou envoyer une demande pour imaginer une création personnalisée adaptée à votre espace, votre histoire ou votre univers décoratif.",
    finalCta: "Parler de mon projet",
  },
  en: {
    seoTitle: "Paper mâché artist in France",
    seoDescription:
      "Discover the world of Marcos Suarez, a paper mâché sculptor creating contemporary sculptures, wall artworks and bespoke handmade pieces.",
    badge: "Paper mâché artist",
    title: "A paper mâché artist blending material, emotion and contemporary sculpture.",
    description:
      "Marcos Suarez creates a sculptural universe where paper mâché becomes a living material. Each artwork is handmade with special attention to volume, texture, light and the presence of the piece within a space.",
    primaryCta: "Discover the sculptures",
    secondaryCta: "Order a custom piece",
    introEyebrow: "A handcrafted and contemporary practice",
    introTitle: "Turning paper into sculptural presence.",
    introText:
      "Paper mâché makes it possible to create lightweight, expressive and deeply textured works. In the studio, paper, cardboard and recycled materials are transformed into wall sculptures, art objects, sculptural lighting and unique decorative pieces.",
    blocks: [
      {
        title: "Unique sculptures",
        text: "Each creation is conceived as a singular piece, with its own reliefs, sensitive imperfections and identity.",
      },
      {
        title: "Recycled materials",
        text: "Paper, cardboard and reused materials become an artistic foundation for new sculptural forms.",
      },
      {
        title: "Bespoke creation",
        text: "A piece can be imagined from a memory, a place, a portrait, a symbolic object or a decorative intention.",
      },
      {
        title: "Contemporary universe",
        text: "The approach combines handcrafted gesture, formal research, organic textures and contemporary aesthetics.",
      },
    ],
    processEyebrow: "Why choose paper mâché?",
    processTitle: "An expressive, sustainable and deeply artisanal material.",
    processText:
      "Paper mâché offers rare freedom: it allows organic forms to be modeled, relief to be created, light to be integrated and a very personal presence to be given to each sculpture. This humble material becomes an artistic language capable of transforming an interior.",
    finalTitle: "Looking for a custom paper mâché sculpture?",
    finalDescription:
      "You can discover existing works or send a request to imagine a personalized creation adapted to your space, your story or your decorative universe.",
    finalCta: "Discuss my project",
  },
  es: {
    seoTitle: "Artista de papel maché en Francia",
    seoDescription:
      "Descubre el universo de Marcos Suarez, artista escultor en papel maché, creador de esculturas contemporáneas, obras murales y piezas personalizadas hechas a mano.",
    badge: "Artista de papel maché",
    title: "Un artista de papel maché entre materia, emoción y escultura contemporánea.",
    description:
      "Marcos Suarez desarrolla un universo escultórico donde el papel maché se convierte en una materia viva. Cada obra está hecha a mano con una atención especial al volumen, la textura, la luz y la presencia de la pieza en el espacio.",
    primaryCta: "Descubrir las esculturas",
    secondaryCta: "Encargar una creación",
    introEyebrow: "Una práctica artesanal y contemporánea",
    introTitle: "Transformar el papel en presencia escultórica.",
    introText:
      "El papel maché permite crear obras ligeras, expresivas y profundamente texturizadas. En el taller, el papel, el cartón y los materiales reciclados se transforman en esculturas murales, objetos artísticos, luminarias escultóricas y piezas decorativas únicas.",
    blocks: [
      {
        title: "Esculturas únicas",
        text: "Cada creación se piensa como una pieza singular, con sus relieves, imperfecciones sensibles e identidad propia.",
      },
      {
        title: "Materiales reciclados",
        text: "El papel, el cartón y los materiales reutilizados se convierten en una base artística para dar vida a nuevas formas.",
      },
      {
        title: "Creación personalizada",
        text: "Una obra puede imaginarse a partir de un recuerdo, un lugar, un retrato, un objeto simbólico o una intención decorativa.",
      },
      {
        title: "Universo contemporáneo",
        text: "El enfoque mezcla gesto artesanal, búsqueda de forma, texturas orgánicas y estética contemporánea.",
      },
    ],
    processEyebrow: "¿Por qué elegir el papel maché?",
    processTitle: "Una materia expresiva, sostenible y profundamente artesanal.",
    processText:
      "El papel maché ofrece una libertad especial: permite modelar formas orgánicas, crear relieve, integrar la luz y dar una presencia muy personal a cada escultura. Esta materia humilde se convierte en un lenguaje artístico capaz de transformar un interior.",
    finalTitle: "¿Buscas una escultura personalizada en papel maché?",
    finalDescription:
      "Puedes descubrir las obras existentes o enviar una solicitud para imaginar una creación personalizada adaptada a tu espacio, tu historia o tu universo decorativo.",
    finalCta: "Hablar de mi proyecto",
  },
};

type LocaleKey = keyof typeof pageContent;

const icons = [Gem, Recycle, HandHeart, Brush];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = pageContent[locale as LocaleKey] ?? pageContent.fr;

  return createMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: `/${locale}/artiste-papier-mache`,
    locale,
    image: siteConfig.defaultOgImage,
  });
}

export default async function ArtistePapierMachePage({ params }: Props) {
  const { locale } = await params;
  const content = pageContent[locale as LocaleKey] ?? pageContent.fr;

  setRequestLocale(locale);

  const pageUrl = `${siteConfig.domain}/${locale}/artiste-papier-mache`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: content.seoTitle,
    description: content.seoDescription,
    image: getAbsoluteUrl(siteConfig.defaultOgImage),
    url: pageUrl,
    inLanguage: locale,
    author: {
      "@type": "Person",
      "@id": `${siteConfig.domain}/${locale}#artist`,
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.domain}/${locale}#organization`,
      name: siteConfig.name,
      url: siteConfig.domain,
      logo: getAbsoluteUrl(siteConfig.logo),
    },
    mainEntityOfPage: pageUrl,
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#paper-mache-service`,
    name: content.seoTitle,
    description: content.seoDescription,
    serviceType: "Création artistique en papier mâché",
    provider: {
      "@type": "Person",
      "@id": `${siteConfig.domain}/${locale}#artist`,
      name: siteConfig.creator,
      url: siteConfig.domain,
      sameAs: [siteConfig.instagram],
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: `${siteConfig.domain}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.badge,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <main className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf4_0%,#f7efe7_42%,#fbf8f3_100%)] text-[#181512]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-[#ff9f43]/18 blur-[120px]" />
          <div className="absolute right-[-10%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-[#f4c38d]/22 blur-[130px]" />
          <div className="absolute bottom-[10%] left-[20%] h-[24rem] w-[24rem] rounded-full bg-[#d7b28a]/14 blur-[120px]" />
        </div>

        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
          <Container>
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center justify-center rounded-full border border-[#ead7c2] bg-white/70 px-4 py-2 shadow-[0_14px_45px_rgba(90,55,25,0.06)] backdrop-blur-xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9b6a43]">
                  {content.badge}
                </span>
              </div>

              <h1 className="mt-7 bg-gradient-to-r from-[#17120f] via-[#805733] to-[#d86208] bg-clip-text text-5xl font-semibold tracking-[-0.055em] text-transparent md:text-7xl">
                {content.title}
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#66584d] md:text-xl md:leading-9">
                {content.description}
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/sculptures"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#f3a34d]/40 bg-[linear-gradient(135deg,#ff9f43,#e76f16,#c85100)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_55px_rgba(231,111,22,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(231,111,22,0.36)]"
                >
                  {content.primaryCta}
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/creations-sur-mesure"
                  className="inline-flex items-center justify-center rounded-full border border-[#ead7c2] bg-white/75 px-6 py-3 text-sm font-semibold text-[#4f4338] shadow-[0_14px_40px_rgba(70,45,20,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#e76f16]/35 hover:bg-white hover:text-[#c85100]"
                >
                  {content.secondaryCta}
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-20 md:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a8754d]">
                  {content.introEyebrow}
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-[#181512] md:text-6xl">
                  {content.introTitle}
                </h2>
              </div>

              <p className="text-base leading-8 text-[#66584d] md:text-lg md:leading-9">
                {content.introText}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {content.blocks.map((block, index) => {
                const Icon = icons[index] ?? Gem;

                return (
                  <article
                    key={block.title}
                    className="group rounded-[2rem] border border-white/70 bg-white/68 p-6 shadow-[0_24px_75px_rgba(65,38,15,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_95px_rgba(65,38,15,0.12)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#efd8c1] bg-[#fff4e9] text-[#c85100] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#181512]">
                      {block.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#65574c]">
                      {block.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="relative py-20 md:py-24">
          <Container>
            <div className="overflow-hidden rounded-[2.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,239,222,0.74))] p-8 shadow-[0_30px_100px_rgba(65,38,15,0.1)] backdrop-blur-2xl md:p-12">
              <div className="max-w-4xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a8754d]">
                  {content.processEyebrow}
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-[#181512] md:text-6xl">
                  {content.processTitle}
                </h2>

                <p className="mt-7 text-base leading-8 text-[#66584d] md:text-lg md:leading-9">
                  {content.processText}
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative pb-24 pt-10 md:pb-32">
          <Container>
            <div className="rounded-[2.75rem] border border-[#ead7c2] bg-[#181512] p-8 text-white shadow-[0_30px_100px_rgba(24,21,18,0.22)] md:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <h2 className="text-4xl font-semibold tracking-[-0.045em] md:text-5xl">
                    {content.finalTitle}
                  </h2>

                  <p className="mt-5 text-base leading-8 text-white/70 md:text-lg">
                    {content.finalDescription}
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#181512] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff2e6]"
                >
                  {content.finalCta}
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}