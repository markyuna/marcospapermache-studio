// src/data/etsy-reviews.ts
// Real, verbatim reviews from the Etsy shop. Text is never translated or edited —
// it is always shown in its original language ("lang"), independent of site locale.

export type EtsyReview = {
  author: string;
  rating: number;
  date: string; // ISO date (YYYY-MM-DD)
  product: string;
  lang: "en" | "fr";
  text: string;
};

export const etsyReviews: EtsyReview[] = [
  {
    author: "cynthia",
    rating: 5,
    date: "2025-11-03",
    product: "Emergences – Relief wall sculpture",
    lang: "en",
    text: "Amazing piece of sculpture; I am pleased beyond expectations with it and Marcos is lovely to do business with……\nThank you very, very much!",
  },
  {
    author: "Tamara",
    rating: 5,
    date: "2024-09-24",
    product: "Majestic Deer Head in Paper Mache",
    lang: "en",
    text: "This is a beautiful piece and it looks amazing on my wall. It is a truly unique piece of art. I love looking at it from different angles. Exceptionally well packaged (although one antler got a little damaged in shipping, it can be easily repaired) and fast shipping considering it was shipped from France. I highly recommend this amazing Etsy artist!",
  },
  {
    author: "San",
    rating: 5,
    date: "2024-05-05",
    product: "Paper mache portrait wall art",
    lang: "fr",
    text: "Excellente communication avec le vendeur et envoi rapide.\nC'est tout simplement magnifique, bien realisé, supers détails et les couleurs sont vives! une vraie oeuvre d'art!\nJe l'adore!",
  },
  {
    author: "Rene",
    rating: 5,
    date: "2022-02-26",
    product: "Deer head",
    lang: "en",
    text: "Sunning, gallery quality art done in industrial black (color options available) that's even better in person. I highly recommend both the item and seller. Please ask him expedited shipping (at a small cost) to receive your order in the US in less than 5 days!",
  },
  {
    author: "joelle",
    rating: 4,
    date: "2020-11-04",
    product: "Mini papier-mâché tree with LEDS",
    lang: "fr",
    text: "BJR BIEN RECU COLIE L ARBRE EST TRES JOLIE JE VOUE REMERCI JE VOUS VOUS SOUHAITE UNE BONNE SOIREE MADAME GAUVRIT JOELLE",
  },
];
