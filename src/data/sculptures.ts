export type Sculpture = {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  images: string[];
  details: string[];
  materials?: string;
  dimensions?: string;
  year?: string;
  availability?: string;
  etsyUrl?: string;
};

export const sculptures: Sculpture[] = [
  {
    slug: "trajectoire",
    title: "Trajectoire",
    subtitle: "Trajectoire — Sculpture murale en relief",
    description:
      "“Trajectoire” est une sculpture murale qui célèbre le mouvement, la transformation et la beauté du recyclage. Entièrement réalisée à la main à partir de matériaux récupérés, cette pièce associe la technique artisanale du papier mâché à des capsules de café Nespresso Vertuo, métamorphosées en éléments dorés qui traversent une surface aux reliefs organiques. L’œuvre invite à une réflexion sur notre parcours personnel et collectif, tout en transformant des objets du quotidien en art porteur de sens et de conscience écologique.",
    images: [
      "/trajectoire.jpg",
      "/trajectoire-detail.jpg",
      "/trajectoire-detail-2.jpg",
    ],
    details: [
      "Pièce sculptée entièrement à la main",
      "Papier mâché et matériaux recyclés",
      "Composition murale texturée",
      "Jeu de reliefs, de lumière et d’ombres",
      "Œuvre contemporaine unique",
    ],
    dimensions: "57 × 73 cm",
    materials:
      "Papier mâché, capsules de café Nespresso Vertuo, peinture acrylique",
    year: "2025",
    availability: "Disponible sur demande",
    etsyUrl: "https://markpaper.etsy.com/listing/4311930608",
  },
  {
    slug: "emergences",
    title: "Emergences",
    subtitle: "Émergences — Sculpture murale en relief",
    description:
      "Émergences est une sculpture murale contemporaine réalisée en papier mâché, mettant en valeur un motif organique inspiré de structures naturelles telles que les cellules ou les alvéoles. Le relief travaillé à la main donne une impression de mouvement fluide et de croissance, capturant la lumière selon l’angle de vue. Chaque pièce est unique, fabriquée artisanalement avec soin. Idéal pour une décoration d’intérieur minimaliste, contemporaine ou inspirée par la nature.",
    images: [
      "/emergences.jpg",
      "/emergences-detail.jpg",
      "/emergences-detail-2.jpg",
    ],
    details: [
      "Œuvre artisanale réalisée à la main",
      "Papier mâché et matières recyclées",
      "Reliefs organiques et texture expressive",
      "Présence visuelle pensée pour l’intérieur contemporain",
      "Pièce unique",
    ],
    dimensions: "57 × 73 cm",
    materials: "Papier mâché, matériaux recyclés, peinture acrylique",
    year: "2025",
    availability: "Vendue",
  },
  {
    slug: "support-a-vins",
    title: "Support à vins",
    subtitle: "Objet sculptural fonctionnel",
    description:
      "Réalisée entièrement en papier mâché, cette cave à vin artistique combine fonctionnalité et poésie visuelle. Des formes ondulantes, presque liquides, sculptent la façade et entourent délicatement les bouteilles, comme portées par un souffle ou une vague. Des alvéoles dorées à l’intérieur évoquent des ruches naturelles ou des coraux, apportant une texture organique à l’ensemble. Un éclairage intégré diffuse une lumière chaleureuse depuis les cavités, sublimant les teintes ambrées du verre. Le plateau supérieur, rehaussé d’un doré satiné, complète cette pièce unique, entre mobilier et sculpture contemporaine.",
    images: [
      "/support-a-vins.jpg",
      "/support-a-vins-detail.jpg",
      "/support-a-vins-detail-2.jpg",
    ],
    details: [
      "Création artisanale originale",
      "Objet fonctionnel à dimension sculpturale",
      "Papier mâché et matériaux recyclés",
      "Pensé pour sublimer la présentation des bouteilles",
      "Pièce décorative de caractère",
    ],
    dimensions: "60 × 100 cm",
    materials: "Papier mâché, matériaux recyclés, finitions artisanales",
    year: "2025",
    availability: "Disponible sur demande",
    etsyUrl: "https://markpaper.etsy.com/listing/4351737928",
  },
];