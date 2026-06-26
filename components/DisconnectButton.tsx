"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export function DisconnectButton() {
  const router = useRouter();

  async function disconnect() {
    await fetch("/api/shopify/disconnect", { method: "POST" });
    router.refresh();
  }

  return (
    <Button type="button" variant="danger" onClick={disconnect}>
      Disconnect Store
    </Button>
  );
}
