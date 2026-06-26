import Link from "next/link";
import { Card } from "@/components/Card";
import { ShopifyConnectForm } from "@/components/ShopifyConnectForm";
import { UploadForm } from "@/components/UploadForm";
import { requireUser } from "@/lib/auth/session";

export default async function UploadPage() {
  const user = await requireUser();
  const connected = Boolean(user.store?.encryptedAccessToken);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Upload PDF</h1>
        <p className="mt-1 text-sm text-gray-600">Create a preview from a courier COD report before updating Shopify.</p>
      </div>
      <Card>
        {connected ? (
          <UploadForm />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Connect your Shopify store before uploading courier reports.</p>
            <ShopifyConnectForm />
            <Link href="/shopify" className="text-sm font-medium text-accent">Manage Shopify connection</Link>
          </div>
        )}
      </Card>
    </div>
  );
}
