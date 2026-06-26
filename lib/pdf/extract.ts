import pdfParse from "pdf-parse";

export async function extractPdfText(file: File) {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await pdfParse(buffer);

  return parsed.text;
}
