import { NextRequest, NextResponse } from "next/server";
import { signPurchaseToken } from "@/lib/ai/purchase-token";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/get-festie", request.url));
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // Dev mode — skip verification
    const token = signPurchaseToken(sessionId);
    const response = NextResponse.redirect(
      new URL("/guide/coachella/ai", request.url)
    );
    response.cookies.set("festie-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/get-festie", request.url));
    }

    const token = signPurchaseToken(sessionId);
    const response = NextResponse.redirect(
      new URL("/guide/coachella/ai", request.url)
    );
    response.cookies.set("festie-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  } catch (error) {
    console.error("Purchase verification failed:", error);
    return NextResponse.redirect(new URL("/get-festie", request.url));
  }
}
