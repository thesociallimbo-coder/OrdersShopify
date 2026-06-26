import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Card } from "@/components/Card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="mt-1 text-sm text-gray-600">Continue reconciling COD payments.</p>
        </div>
        <AuthForm mode="login" />
        <p className="mt-4 text-sm text-gray-600">
          New here? <Link className="font-medium text-accent" href="/register">Create an account</Link>
        </p>
      </Card>
    </main>
  );
}
