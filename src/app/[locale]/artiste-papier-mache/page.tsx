// src/app/[locale]/artiste-papier-mache/page.tsx

import type { Metadata } from "next";
import {
  ArrowRight,
  Brush,
  Gem,
  HandHeart,
  MapPin,
  Recycle,
  Sparkles,
} from "lucide-react";
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
    seoTitle:
      "Artiste papier mâché en France | Sculptures sur mesure et œuvres murales",
    seoDescription:
      "Vous recherchez un artiste papier mâché en France ? Marcos Suarez crée des sculptures contemporaines, œuvres murales, luminaires et pièces sur mesure façonnées à la main.",
    badge: "Artiste papier mâché en France",
    title:
      "Sculptures en papier mâché sur mesure, œuvres murales et créations artisanales.",
    description:
      "Vous recherchez une sculpture en papier mâché unique pour votre intérieur, un projet décoratif, une œuvre murale ou une création personnalisée ? Marcos Suarez réalise des pièces contemporaines façonnées à la main à partir de papier, carton et matières recyclées.",
    primaryCta: "Découvrir les sculptures",
    secondaryCta: "Commander une création",
    introEyebrow: "Créations artisanales en papier mâché",
    introTitle: "Des pièces uniques pour particuliers, décorateurs et projets d’intérieur.",
    introText:
      "Chaque sculpture est imaginée comme une présence décorative forte : une œuvre murale, un objet sculptural, un luminaire, une pièce symbolique ou une création sur mesure. Le papier mâché permet de créer du relief, de la texture, de la légèreté et une esthétique organique adaptée aux intérieurs contemporains.",
    blocks: [
      {
        title: "Sculptures sur mesure",
        text: "Création d’une pièce personnalisée à partir d’une idée, d’un souvenir, d’un symbole, d’un espace ou d’une intention décorative.",
      },
      {
        title: "Œuvres murales",
        text: "Réalisation de sculptures murales en papier mâché pour apporter du volume, de la matière et une présence artistique à un mur.",
      },
      {
        title: "Décoration intérieure",
        text: "Pièces pensées pour dialoguer avec un salon, une entrée, une chambre, une boutique, un restaurant ou un espace créatif.",
      },
      {
        title: "Matières recyclées",
        text: "Utilisation de papier, carton et matériaux réutilisés transformés en formes sculpturales contemporaines.",
      },
    ],
    processEyebrow: "Pourquoi choisir une sculpture en papier mâché ?",
    processTitle:
      "Une matière légère, expressive et idéale pour les créations personnalisées.",
    processText:
      "Le papier mâché offre une grande liberté de forme. Il permet de créer des volumes organiques, des textures profondes et des pièces légères qui peuvent s’intégrer facilement dans un intérieur. Chaque œuvre est façonnée à la main, ce qui rend chaque relief, chaque finition et chaque détail véritablement unique.",
    servicesEyebrow: "Ce que vous pouvez commander",
    servicesTitle: "Une création adaptée à votre espace et à votre intention.",
    services: [
      "Sculpture décorative en papier mâché",
      "Œuvre murale texturée",
      "Luminaire sculptural",
      "Pièce personnalisée à partir d’un souvenir",
      "Création pour boutique, restaurant ou lieu culturel",
      "Objet artistique pour décoration intérieure",
    ],
    locationEyebrow: "Disponibilité",
    locationTitle: "Un artiste papier mâché basé en France.",
    locationText:
      "Les créations peuvent être réalisées pour des projets en France. Chaque demande est étudiée selon les dimensions, le style recherché, les contraintes de livraison et le niveau de personnalisation souhaité.",
    finalTitle: "Vous cherchez une sculpture en papier mâché sur mesure ?",
    finalDescription:
      "Envoyez votre idée, vos inspirations, les dimensions souhaitées ou quelques photos de votre espace. Nous pourrons imaginer ensemble une création artisanale adaptée à votre univers.",
    finalCta: "Parler de mon projet",
  },
  en: {
    seoTitle:
      "Paper mâché artist in France | Custom sculptures and wall artworks",
    seoDescription:
      "Looking for a paper mâché artist in France? Marcos Suarez creates contemporary sculptures, wall artworks, sculptural lighting and bespoke handmade pieces.",
    badge: "Paper mâché artist in France",
    title:
      "Custom paper mâché sculptures, wall artworks and handmade creations.",
    description:
      "Looking for a unique paper mâché sculpture for your interior, a decorative project, a wall artwork or a personalized piece? Marcos Suarez creates contemporary handmade works using paper, cardboard and recycled materials.",
    primaryCta: "Discover the sculptures",
    secondaryCta: "Order a custom piece",
    introEyebrow: "Handmade paper mâché creations",
    introTitle: "Unique pieces for homes, decorators and interior projects.",
    introText:
      "Each sculpture is imagined as a strong decorative presence: a wall artwork, a sculptural object, a light piece, a symbolic work or a bespoke creation. Paper mâché makes it possible to create relief, texture, lightness and an organic aesthetic suited to contemporary interiors.",
    blocks: [
      {
        title: "Custom sculptures",
        text: "Creation of a personalized piece based on an idea, a memory, a symbol, a space or a decorative intention.",
      },
      {
        title: "Wall artworks",
        text: "Paper mâché wall sculptures designed to bring volume, material and artistic presence to a wall.",
      },
      {
        title: "Interior decoration",
        text: "Pieces designed to interact with a living room, entrance, bedroom, boutique, restaurant or creative space.",
      },
      {
        title: "Recycled materials",
        text: "Paper, cardboard and reused materials transformed into contemporary sculptural forms.",
      },
    ],
    processEyebrow: "Why choose a paper mâché sculpture?",
    processTitle:
      "A lightweight, expressive material ideal for personalized creations.",
    processText:
      "Paper mâché offers great freedom of form. It makes it possible to create organic volumes, deep textures and lightweight pieces that can easily fit into an interior. Each artwork is handmade, making every relief, finish and detail truly unique.",
    servicesEyebrow: "What you can order",
    servicesTitle: "A creation adapted to your space and intention.",
    services: [
      "Decorative paper mâché sculpture",
      "Textured wall artwork",
      "Sculptural lighting",
      "Personalized piece based on a memory",
      "Creation for a boutique, restaurant or cultural space",
      "Art object for interior decoration",
    ],
    locationEyebrow: "Availability",
    locationTitle: "A paper mâché artist based in France.",
    locationText:
      "Creations can be made for projects in France. Each request is studied according to dimensions, desired style, delivery constraints and the level of personalization required.",
    finalTitle: "Looking for a custom paper mâché sculpture?",
    finalDescription:
      "Send your idea, inspirations, desired dimensions or a few photos of your space. Together, we can imagine a handmade creation adapted to your universe.",
    finalCta: "Discuss my project",
  },
  es: {
    seoTitle:
      "Artista de papel maché en Francia | Esculturas personalizadas y obras murales",
    seoDescription:
      "¿Buscas un artista de papel maché en Francia? Marcos Suarez crea esculturas contemporáneas, obras murales, luminarias escultóricas y piezas personalizadas hechas a mano.",
    badge: "Artista de papel maché en Francia",
    title:
      "Esculturas de papel maché personalizadas, obras murales y creaciones artesanales.",
    description:
      "¿Buscas una escultura de papel maché única para tu interior, un proyecto decorativo, una obra mural o una pieza personalizada? Marcos Suarez realiza obras contemporáneas hechas a mano a partir de papel, cartón y materiales reciclados.",
    primaryCta: "Descubrir las esculturas",
    secondaryCta: "Encargar una creación",
    introEyebrow: "Creaciones artesanales en papel maché",
    introTitle:
      "Piezas únicas para particulares, decoradores y proyectos de interior.",
    introText:
      "Cada escultura se imagina como una presencia decorativa fuerte: una obra mural, un objeto escultórico, una luminaria, una pieza simbólica o una creación personalizada. El papel maché permite crear relieve, textura, ligereza y una estética orgánica adaptada a interiores contemporáneos.",
    blocks: [
      {
        title: "Esculturas personalizadas",
        text: "Creación de una pieza a medida a partir de una idea, un recuerdo, un símbolo, un espacio o una intención decorativa.",
      },
      {
        title: "Obras murales",
        text: "Realización de esculturas murales en papel maché para aportar volumen, materia y presencia artística a una pared.",
      },
      {
        title: "Decoración interior",
        text: "Piezas pensadas para dialogar con un salón, una entrada, una habitación, una tienda, un restaurante o un espacio creativo.",
      },
      {
        title: "Materiales reciclados",
        text: "Uso de papel, cartón y materiales reutilizados transformados en formas escultóricas contemporáneas.",
      },
    ],
    processEyebrow: "¿Por qué elegir una escultura de papel maché?",
    processTitle:
      "Una materia ligera, expresiva e ideal para creaciones personalizadas.",
    processText:
      "El papel maché ofrece una gran libertad de forma. Permite crear volúmenes orgánicos, texturas profundas y piezas ligeras que pueden integrarse fácilmente en un interior. Cada obra está hecha a mano, lo que hace que cada relieve, acabado y detalle sea verdaderamente único.",
    servicesEyebrow: "Qué puedes encargar",
    servicesTitle: "Una creación adaptada a tu espacio y a tu intención.",
    services: [
      "Escultura decorativa en papel maché",
      "Obra mural texturizada",
      "Luminaria escultórica",
      "Pieza personalizada a partir de un recuerdo",
      "Creación para tienda, restaurante o espacio cultural",
      "Objeto artístico para decoración interior",
    ],
    locationEyebrow: "Disponibilidad",
    locationTitle: "Un artista de papel maché basado en Francia.",
    locationText:
      "Las creaciones pueden realizarse para proyectos en Francia. Cada solicitud se estudia según las dimensiones, el estilo deseado, las condiciones de entrega y el nivel de personalización requerido.",
    finalTitle: "¿Buscas una escultura personalizada en papel maché?",
    finalDescription:
      "Envía tu idea, tus inspiraciones, las dimensiones deseadas o algunas fotos de tu espacio. Juntos podremos imaginar una creación artesanal adaptada a tu universo.",
    finalCta: "Hablar de mi proyecto",
  },
};

type LocaleKey = keyof typeof pageContent;

const icons = [HandHeart, Brush, Gem, Recycle];

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
    serviceType: "Création artistique en papier mâché sur mesure",
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
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Service",
        name: content.seoTitle,
        description: content.seoDescription,
      },
    },
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
                  <span>{content.primaryCta}</span>
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

        <section className="relative py-20 md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a8754d]">
                  {content.servicesEyebrow}
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-[#181512] md:text-6xl">
                  {content.servicesTitle}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {content.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-white/70 bg-white/72 p-5 shadow-[0_18px_55px_rgba(65,38,15,0.06)] backdrop-blur-xl"
                  >
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1e5] text-[#c85100]">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <p className="text-sm font-medium leading-7 text-[#4f4338]">
                      {service}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-20 md:py-24">
          <Container>
            <div className="rounded-[2.5rem] border border-[#ead7c2] bg-white/72 p-8 shadow-[0_24px_75px_rgba(65,38,15,0.08)] backdrop-blur-xl md:p-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#efd8c1] bg-[#fff4e9] text-[#c85100] shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>

                <div className="max-w-4xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a8754d]">
                    {content.locationEyebrow}
                  </p>

                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#181512] md:text-5xl">
                    {content.locationTitle}
                  </h2>

                  <p className="mt-5 text-base leading-8 text-[#66584d] md:text-lg md:leading-9">
                    {content.locationText}
                  </p>
                </div>
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

                <div className="flex justify-start lg:justify-end">
                  <Link
                    href="/contact"
                    className="group inline-flex w-fit items-center justify-center gap-2 rounded-full border border-white/80 bg-white px-7 py-4 text-sm font-semibold text-[#181512] shadow-[0_18px_55px_rgba(255,255,255,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff2e6] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#181512]"
                  >
                    <span className="whitespace-nowrap text-[#181512]">
                      {content.finalCta}
                    </span>

                    <ArrowRight className="h-4 w-4 shrink-0 text-[#181512] transition duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}