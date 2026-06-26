"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";

type ShopifyConnectValues = {
  shop: string;
};

export function ShopifyConnectForm({ label = "Connect Shopify" }: { label?: string }) {
  const { register, handleSubmit } = useForm<ShopifyConnectValues>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(values: ShopifyConnectValues) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/shopify/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to start Shopify connection");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3 sm:flex-row">
      <input
        className="min-h-10 flex-1 rounded-md border border-gray-300 px-3 outline-none focus:border-accent"
        placeholder="your-store.myshopify.com"
        {...register("shop", { required: true })}
        required
      />
      <Button disabled={loading}>{loading ? "Redirecting" : label}</Button>
      {error ? <p className="text-sm text-red-600 sm:basis-full">{error}</p> : null}
    </form>
  );
}
