import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/admin-auth";
import { CREDIT_PACKAGE } from "@/lib/user-credits";
import { getStripe } from "@/lib/stripe";

type RequestBody = {
  returnPath?: string;
};

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const origin = new URL(request.url).origin;
    const body = (await request.json()) as RequestBody;

    const returnPath =
      typeof body?.returnPath === "string" && body.returnPath.startsWith("/")
        ? body.returnPath
        : "/create";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: CREDIT_PACKAGE.priceEurCents,
            product_data: {
              name: `Pack de ${CREDIT_PACKAGE.credits} générations IA`,
              description:
                "Accès supplémentaire à l’expérience de création assistée par IA.",
            },
          },
        },
      ],
      metadata: {
        supabaseUserId: user.id,
      },
      success_url: `${origin}${returnPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnPath}?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur pendant la création du paiement." },
      { status: 500 },
    );
  }
}
