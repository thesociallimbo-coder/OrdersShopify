"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: new FormData(event.currentTarget)
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    router.push(`/history/${data.uploadId}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        type="file"
        name="file"
        accept="application/pdf"
        required
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button disabled={loading}>{loading ? "Processing" : "Create Preview"}</Button>
    </form>
  );
}
