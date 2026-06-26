import { Card } from "@/components/Card";
import { DisconnectButton } from "@/components/DisconnectButton";
import { ShopifyConnectForm } from "@/components/ShopifyConnectForm";
import { requireUser } from "@/lib/auth/session";

export default async function ShopifyPage() {
  const user = await requireUser();
  const connected = Boolean(user.store?.encryptedAccessToken);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Shopify</h1>
        <p className="mt-1 text-sm text-gray-600">Connect or reconnect the store used for payment reconciliation.</p>
      </div>
      <Card className="space-y-5">
        <div>
          <div className="text-sm text-gray-500">Connection Status</div>
          <div className="mt-2 text-lg font-semibold">
            {connected ? "Green: Shopify Connected" : "Red: Shopify Disconnected"}
          </div>
        </div>
        {user.store ? (
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <div className="text-gray-500">Store</div>
              <div className="mt-1 font-medium">{user.store.shopDomain}</div>
            </div>
            <div>
              <div className="text-gray-500">Installed</div>
              <div className="mt-1 font-medium">{user.store.installedAt?.toLocaleString() ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Last Check</div>
              <div className="mt-1 font-medium">{user.store.lastConnectionCheck?.toLocaleString() ?? "-"}</div>
            </div>
          </div>
        ) : null}
        <ShopifyConnectForm label={connected ? "Reconnect Shopify" : "Connect Shopify"} />
        {connected ? <DisconnectButton /> : null}
      </Card>
    </div>
  );
}
