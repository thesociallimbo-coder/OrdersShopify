import Link from "next/link";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/SignOutButton";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Upload PDF", "/upload"],
  ["History", "/history"],
  ["Shopify", "/shopify"],
  ["Account", "/account"]
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-gray-200 p-6 md:block">
          <div className="mb-8">
            <div className="text-lg font-semibold">COD Reconcile</div>
            <div className="mt-1 truncate text-sm text-gray-500">{user.email}</div>
          </div>
          <nav className="space-y-1">
            {nav.map(([label, href]) => (
              <Link key={href} className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            <SignOutButton />
          </div>
        </aside>
        <section className="flex-1">
          <div className="border-b border-gray-200 px-4 py-3 md:hidden">
            <div className="font-semibold">COD Reconcile</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {nav.map(([label, href]) => (
                <Link key={href} className="rounded-md border border-gray-200 px-3 py-1 text-sm" href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
