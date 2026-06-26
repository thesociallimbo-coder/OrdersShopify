import { NextResponse } from "next/server";
import { z } from "zod";
import { rejectCrossOrigin } from "@/lib/auth/csrf";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const csrfError = rejectCrossOrigin(request);
  if (csrfError) return csrfError;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Password reset email delivery is ready to connect to your mail provider."
  });
}
