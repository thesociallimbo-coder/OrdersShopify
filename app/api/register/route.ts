import { NextResponse } from "next/server";
import { z } from "zod";
import { rejectCrossOrigin } from "@/lib/auth/csrf";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";

const schema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(10, "Use at least 10 characters")
});

export async function POST(request: Request) {
  const csrfError = rejectCrossOrigin(request);
  if (csrfError) return csrfError;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password)
      }
    });
  } catch {
    return NextResponse.json({ error: "That email is already registered" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
