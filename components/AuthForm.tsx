"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";

type AuthFormValues = {
  email: string;
  password: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<AuthFormValues>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(values: AuthFormValues) {
    setError("");
    setLoading(true);

    if (mode === "register") {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        setError((await response.json()).error ?? "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });

    setLoading(false);
    if (result?.error) {
      setError("Email or password is incorrect");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-accent"
          type="email"
          {...register("email", { required: true })}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-accent"
          type="password"
          {...register("password", { required: true })}
          required
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button disabled={loading} className="w-full">
        {loading ? "Please wait" : mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
}
