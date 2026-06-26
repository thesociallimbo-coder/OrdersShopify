"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/Button";

export function ChangePasswordForm() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/password/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.get("currentPassword"),
        newPassword: form.get("newPassword")
      })
    });
    const data = await response.json();
    setMessage(response.ok ? "Password updated" : data.error ?? "Password update failed");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="w-full rounded-md border border-gray-300 px-3 py-2" name="currentPassword" type="password" placeholder="Current password" required />
      <input className="w-full rounded-md border border-gray-300 px-3 py-2" name="newPassword" type="password" placeholder="New password" required />
      <Button>Change Password</Button>
      {message ? <p className="text-sm text-gray-600">{message}</p> : null}
    </form>
  );
}

export function ResetPasswordForm() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") })
    });
    const data = await response.json();
    setMessage(data.message ?? (response.ok ? "Reset requested" : "Reset failed"));
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="w-full rounded-md border border-gray-300 px-3 py-2" name="email" type="email" placeholder="Email" required />
      <Button variant="secondary">Send Reset Link</Button>
      {message ? <p className="text-sm text-gray-600">{message}</p> : null}
    </form>
  );
}
