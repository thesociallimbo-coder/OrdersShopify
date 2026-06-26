import { NextResponse } from "next/server";
import { rejectCrossOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const csrfError = rejectCrossOrigin(request);
  if (csrfError) return csrfError;

  const user = await requireUser();
  if (!user.store) {
    return NextResponse.json({ ok: true });
  }

  await prisma.store.update({
    where: { id: user.store.id },
    data: { encryptedAccessToken: null, disconnectedAt: new Date() }
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "shopify.disconnected" }
  });

  return NextResponse.json({ ok: true });
}
