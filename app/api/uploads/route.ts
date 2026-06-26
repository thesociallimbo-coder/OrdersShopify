import { NextResponse } from "next/server";
import { rejectCrossOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { extractPdfText } from "@/lib/pdf/extract";
import { parseCourierReport } from "@/lib/parsers";
import { buildUploadPreview } from "@/lib/orders/reconcile";
import { sanitizeFilename } from "@/utils/filename";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const csrfError = rejectCrossOrigin(request);
  if (csrfError) return csrfError;

  const user = await requireUser();
  if (!user.store?.encryptedAccessToken) {
    return NextResponse.json({ error: "Connect Shopify before uploading reports" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a PDF file" }, { status: 400 });
  }

  try {
    const text = await extractPdfText(file);
    const parsed = parseCourierReport(text);
    const uploadId = await buildUploadPreview(user.store.id, parsed.orderNumbers, sanitizeFilename(file.name));

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "upload.preview_created",
        metadata: { uploadId, courier: parsed.courier, ordersFound: parsed.orderNumbers.length }
      }
    });

    return NextResponse.json({ uploadId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload processing failed" },
      { status: 400 }
    );
  }
}
