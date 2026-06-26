import { NextResponse } from "next/server";

export function rejectCrossOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const expected = process.env.APP_URL ?? process.env.NEXTAUTH_URL;

  if (!origin || !host) {
    return null;
  }

  const originHost = new URL(origin).host;
  const expectedHost = expected ? new URL(expected).host : host;

  if (originHost !== host && originHost !== expectedHost) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  return null;
}
