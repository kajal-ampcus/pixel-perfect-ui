import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, AlertTriangle, RefreshCw, Package, Filter, CheckCheck } from "lucide-react";
import { KitchenLayout } from "./kitchen";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/kitchen-notifications")({ component: KitchenNotifications });

function KitchenNotifications() {
  const orders = useStore((s) => s.orders);
  const list = orders
    .filter((order) => ["Pending", "Preparing", "Ready", "Cancelled"].includes(order.status))
    .slice(0, 12)
    .map((order) => {
      const isCancelled = order.status === "Cancelled";
      const isReady = order.status === "Ready";
      return {
        icon: isCancelled
          ? AlertTriangle
          : isReady
            ? Package
            : order.status === "Preparing"
              ? RefreshCw
              : ShoppingBag,
        color: isCancelled
          ? "bg-destructive/20 text-destructive"
          : isReady
            ? "bg-success/20 text-success"
            : "bg-primary/20 text-primary",
        type: isCancelled
          ? "Cancelled"
          : isReady
            ? "Ready"
            : order.status === "Preparing"
              ? "Update"
              : "New Order",
        msg: isCancelled
          ? `Order Cancelled ${order.orderNumber}`
          : `${order.status === "Pending" ? "New Order Received" : `Order ${order.status}`} ${order.orderNumber}`,
        sub: `${order.customerName} - ${order.slot} - ${order.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}`,
        time: timeAgo(new Date(order.cancelledAt ?? order.createdAt)),
        status: isCancelled ? "Removed" : "Active",
        statusColor: isCancelled
          ? "bg-destructive/15 text-destructive"
          : "bg-primary/15 text-primary",
      };
    });

  return (
    <KitchenLayout title="Notifications">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications Center</h1>
          <p className="text-xs text-muted-foreground">
            Live order events from employee checkout and kitchen status changes.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs">
            <Filter className="h-3 w-3" /> Filter Alerts
          </button>
          <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <CheckCheck className="h-3 w-3" /> Mark All Seen
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="hidden grid-cols-[1fr_2.5fr_1fr_0.8fr] border-b border-border px-4 py-2 text-[10px] tracking-wider text-muted-foreground md:grid">
          <span>TYPE</span>
          <span>MESSAGE</span>
          <span>TIME</span>
          <span>STATUS</span>
        </div>

        {list.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No kitchen alerts right now.
          </div>
        ) : (
          list.map((n, i) => (
            <div
              key={`${n.msg}-${i}`}
              className="grid items-start gap-3 border-b border-border/60 px-4 py-3 last:border-0 md:grid-cols-[1fr_2.5fr_1fr_0.8fr] md:items-center"
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${n.color}`}>
                  <n.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold">{n.type}</span>
              </div>
              <div>
                <div className="text-xs font-semibold">{n.msg}</div>
                <div className="text-[10px] text-muted-foreground">{n.sub}</div>
              </div>
              <div className="text-xs text-muted-foreground md:text-left">{n.time}</div>
              <div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${n.statusColor}`}>
                  {n.status}
                </span>
              </div>
            </div>
          ))
        )}

        <div className="flex items-center justify-between p-3 text-xs text-muted-foreground">
          <span>Showing {list.length} live alerts</span>
          <span>Auto-updates with order changes</span>
        </div>
      </div>
    </KitchenLayout>
  );
}

function timeAgo(date: Date) {
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} mins ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}
