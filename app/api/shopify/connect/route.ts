import { NextResponse } from "next/server";
import { z } from "zod";
import { rejectCrossOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { buildShopifyInstallUrl } from "@/lib/shopify/oauth";

const schema = z.object({
  shop: z.string().min(1)
});

export async function POST(request: Request) {
  const csrfError = rejectCrossOrigin(request);
  if (csrfError) return csrfError;

  await requireUser();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your Shopify store URL" }, { status: 400 });
  }

  const url = await buildShopifyInstallUrl(parsed.data.shop);
  return NextResponse.json({ url });
}
