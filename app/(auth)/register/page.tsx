import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Card } from "@/components/Card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-gray-600">Set up your Shopify COD reconciliation workspace.</p>
        </div>
        <AuthForm mode="register" />
        <p className="mt-4 text-sm text-gray-600">
          Already registered? <Link className="font-medium text-accent" href="/login">Log in</Link>
        </p>
      </Card>
    </main>
  );
}
