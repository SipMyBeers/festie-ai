import { createHmac } from "crypto";

const SECRET = process.env.PURCHASE_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY || "";

export function signPurchaseToken(sessionId: string): string {
  const payload = `festie-purchased:${sessionId}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${sessionId}.${sig}`;
}

export function verifyPurchaseToken(token: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [sessionId, sig] = token.split(".");
  if (!sessionId || !sig) return false;
  const expected = createHmac("sha256", SECRET)
    .update(`festie-purchased:${sessionId}`)
    .digest("hex");
  // Constant-time comparison
  if (sig.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < sig.length; i++) {
    result |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}
