import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    // Stripe not configured — redirect to free access
    return NextResponse.json({ url: "/guide/coachella" });
  }

  try {
    // Dynamic import to avoid build errors when stripe isn't installed
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Festie AI — Offline Festival Bot",
              description:
                "AI festival guide powered by Gemma 4, runs 100% on your phone. Includes offline schedule, venue map, FAQ, and saved acts.",
            },
            unit_amount: 499, // $4.99
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/guide/coachella/ai?purchased=true`,
      cancel_url: `${request.nextUrl.origin}/get-festie`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ url: "/guide/coachella" });
  }
}
