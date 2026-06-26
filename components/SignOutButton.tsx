"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/Button";

export function SignOutButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
      Log out
    </Button>
  );
}
