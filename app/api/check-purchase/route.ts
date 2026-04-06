import { NextRequest, NextResponse } from "next/server";
import { verifyPurchaseToken } from "@/lib/ai/purchase-token";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("festie-token")?.value;
  const valid = token ? verifyPurchaseToken(token) : false;
  return NextResponse.json({ purchased: valid });
}
