import { Card } from "@/components/Card";
import { ChangePasswordForm, ResetPasswordForm } from "@/components/PasswordForms";
import { SignOutButton } from "@/components/SignOutButton";
import { requireUser } from "@/lib/auth/session";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-1 text-sm text-gray-600">Manage login details and session access.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Profile</h2>
          <div className="text-sm text-gray-500">Email</div>
          <div className="mt-1 font-medium">{user.email}</div>
          <div className="mt-5">
            <SignOutButton />
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Change Password</h2>
          <ChangePasswordForm />
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Reset Password</h2>
          <ResetPasswordForm />
        </Card>
      </div>
    </div>
  );
}
