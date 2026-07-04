import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { addUserCredits, CREDIT_PACKAGE } from "@/lib/user-credits";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook non configuré." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch {
    return NextResponse.json(
      { error: "Signature invalide." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabaseUserId = session.metadata?.supabaseUserId;

    if (supabaseUserId) {
      await addUserCredits(supabaseUserId, CREDIT_PACKAGE.credits);
    }
  }

  return NextResponse.json({ received: true });
}
