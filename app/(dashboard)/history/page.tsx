import Link from "next/link";
import { Card } from "@/components/Card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function HistoryPage() {
  const user = await requireUser();
  const uploads = user.store
    ? await prisma.upload.findMany({ where: { storeId: user.store.id }, orderBy: { uploadedAt: "desc" } })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="mt-1 text-sm text-gray-600">Reopen previous upload previews and audit the final results.</p>
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Filename</th>
              <th className="px-5 py-3">Uploaded</th>
              <th className="px-5 py-3">Found</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Skipped</th>
              <th className="px-5 py-3">Failed</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {uploads.map((upload) => (
              <tr key={upload.id}>
                <td className="px-5 py-3 font-medium">
                  <Link className="text-accent" href={`/history/${upload.id}`}>{upload.filename}</Link>
                </td>
                <td className="px-5 py-3">{upload.uploadedAt.toLocaleString()}</td>
                <td className="px-5 py-3">{upload.ordersFound}</td>
                <td className="px-5 py-3">{upload.ordersUpdated}</td>
                <td className="px-5 py-3">{upload.ordersSkipped}</td>
                <td className="px-5 py-3">{upload.ordersFailed}</td>
                <td className="px-5 py-3">{upload.status}</td>
              </tr>
            ))}
            {!uploads.length ? (
              <tr>
                <td className="px-5 py-6 text-gray-500" colSpan={7}>No uploads yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
