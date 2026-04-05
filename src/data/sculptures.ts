export type Sculpture = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  details: string[];
  materials: string;
  dimensions: string;
  year: string;
  availability: string;
  vision: string;
};

export const sculptures: Sculpture[] = [
  {
    slug: "trajectoire",
    title: "Trajectoire",
    subtitle: "Trajectoire — Sculpture murale en relief",
    description:
      "Trajectoire est une sculpture murale qui célèbre le mouvement, la transformation et la beauté du recyclage...",
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
    vision:
      "Trajectoire incarne la transformation et le mouvement à travers l’art du recyclage...",
    year: "2025",
    availability: "Disponible sur demande",
  },
  {
    slug: "emergences",
    title: "Emergences",
    subtitle: "Émergences — Sculpture murale en relief",
    description:
      "Émergences est une sculpture murale contemporaine réalisée en papier mâché...",
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
    vision:
      "Émergences évoque la naissance de formes vivantes à partir de la matière...",
    year: "2025",
    availability: "Vendue",
  },
  {
    slug: "support-a-vins",
    title: "Support à vins",
    subtitle: "Objet sculptural fonctionnel",
    description:
      "Support à vins réunit art et usage dans une création à la fois décorative...",
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
    vision:
      "Avec Support à vins, j’explore la frontière entre sculpture et objet d’usage...",
    year: "2025",
    availability: "Disponible sur demande",
  },
];