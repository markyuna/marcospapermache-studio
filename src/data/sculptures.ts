export type Sculpture = {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    details: string[];
  };
  
  export const sculptures: Sculpture[] = [
    {
      slug: "trajectoire",
      title: "Trajectoire",
      subtitle: "Relief mural contemporain",
      description:
        "Une sculpture murale artisanale qui explore le mouvement, la matière et l’équilibre à travers une composition organique en papier mâché.",
      image: "/trajectoire.jpg",
      details: [
        "Pièce réalisée à la main",
        "Papier mâché et matériaux recyclés",
        "Travail de texture et de relief",
        "Œuvre décorative contemporaine",
      ],
    },
    {
      slug: "emergences",
      title: "Emergences",
      subtitle: "Composition sculpturale organique",
      description:
        "Une œuvre qui met en dialogue la forme, la lumière et la matière, avec une présence sculpturale pensée pour sublimer un intérieur contemporain.",
      image: "/emergences.jpg",
      details: [
        "Cadre et composition artisanale",
        "Matériaux recyclés",
        "Finition texturée",
        "Pièce unique",
      ],
    },
    {
      slug: "support-a-vins",
      title: "Support à vins",
      subtitle: "Objet fonctionnel et sculptural",
      description:
        "Une création entre art et fonctionnalité, imaginée pour exposer les bouteilles comme des éléments d’une composition sculpturale.",
      image: "/support-a-vins.jpg",
      details: [
        "Objet décoratif et fonctionnel",
        "Fabrication artisanale",
        "Design original",
        "Pièce de caractère",
      ],
    },
  ];