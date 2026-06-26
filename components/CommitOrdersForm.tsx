"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type Order = {
  id: string;
  orderNumber: string;
  action: string;
  result: string;
  shopifyStatus: string | null;
  paymentStatus: string | null;
  message: string | null;
};

export function CommitOrdersForm({ uploadId, orders }: { uploadId: string; orders: Order[] }) {
  const router = useRouter();
  const selectable = useMemo(() => orders.filter((order) => order.action === "MARK_PAID" && order.result === "PENDING"), [orders]);
  const [selected, setSelected] = useState(() => selectable.map((order) => order.id));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch(`/api/uploads/${uploadId}/commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ processedOrderIds: selected })
    });

    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error ?? "Shopify update failed");
      return;
    }

    router.refresh();
  }

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="w-12 px-4 py-3">Use</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Shopify Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const canSelect = order.action === "MARK_PAID" && order.result === "PENDING";
              return (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Select order ${order.orderNumber}`}
                      type="checkbox"
                      disabled={!canSelect}
                      checked={selected.includes(order.id)}
                      onChange={() => toggle(order.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">#{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.shopifyStatus ?? "-"}</td>
                  <td className="px-4 py-3">{order.paymentStatus ?? "-"}</td>
                  <td className="px-4 py-3">{order.action.replace("_", " ")}</td>
                  <td className="px-4 py-3">{order.result}</td>
                  <td className="px-4 py-3 text-gray-600">{order.message ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectable.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          <Button disabled={loading || selected.length === 0}>
            {loading ? "Updating Shopify" : `Mark ${selected.length} Selected as Paid`}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSelected(selected.length === selectable.length ? [] : selectable.map((order) => order.id))}
          >
            {selected.length === selectable.length ? "Clear Selection" : "Select All"}
          </Button>
        </div>
      ) : null}
      {error ? <p className="basis-full text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
