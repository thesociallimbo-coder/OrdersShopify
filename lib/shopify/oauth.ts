import crypto from "crypto";
import { cookies } from "next/headers";
import { getShopifyConfig } from "@/lib/shopify/client";
import { normalizeShopDomain } from "@/utils/shop";

const STATE_COOKIE = "shopify_oauth_state";

export async function buildShopifyInstallUrl(shopInput: string) {
  const shop = normalizeShopDomain(shopInput);
  const { apiKey, appUrl, scopes } = getShopifyConfig();
  const state = crypto.randomBytes(24).toString("hex");
  const callbackUrl = `${appUrl}/api/shopify/callback`;

  (await cookies()).set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10
  });

  const params = new URLSearchParams({
    client_id: apiKey,
    scope: scopes,
    redirect_uri: callbackUrl,
    state
  });

  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

export async function verifyShopifyCallback(searchParams: URLSearchParams) {
  const { apiSecret } = getShopifyConfig();
  const state = searchParams.get("state");
  const cookieState = (await cookies()).get(STATE_COOKIE)?.value;

  if (!state || !cookieState || state !== cookieState) {
    throw new Error("Invalid Shopify OAuth state");
  }

  const hmac = searchParams.get("hmac");
  if (!hmac) {
    throw new Error("Missing Shopify OAuth HMAC");
  }

  const digestInput = [...searchParams.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const digest = crypto.createHmac("sha256", apiSecret).update(digestInput).digest("hex");
  const isValid = crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
  if (!isValid) {
    throw new Error("Invalid Shopify OAuth HMAC");
  }

  return {
    shop: normalizeShopDomain(searchParams.get("shop") ?? ""),
    code: searchParams.get("code") ?? ""
  };
}

export async function exchangeCodeForToken(shop: string, code: string) {
  const { apiKey, apiSecret } = getShopifyConfig();
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: apiKey, client_secret: apiSecret, code }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to complete Shopify OAuth");
  }

  return (await response.json()) as { access_token: string; scope: string };
}
