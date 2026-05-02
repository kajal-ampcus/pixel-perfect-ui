import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChefHat,
  Clock3,
  Flame,
  LogOut,
  Search,
  Bell,
  Package,
  CheckCircle2,
  UtensilsCrossed,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { logout, getCurrentUser } from "@/lib/auth";
import { BottomNav, type BottomNavItem } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatINR, updateOrderStatus, useStore, type Order, type OrderStatus } from "@/lib/store";

export const Route = createFileRoute("/kitchen")({ component: Kitchen });

const kitchenNav: BottomNavItem[] = [
  {
    to: "/kitchen",
    label: "Live",
    icon: ChefHat,
    color: "bg-gradient-to-br from-orange-300 to-red-500",
  },
  {
    to: "/kitchen-history",
    label: "History",
    icon: Clock3,
    color: "bg-gradient-to-br from-cyan-300 to-sky-700",
  },
  {
    to: "/kitchen-notifications",
    label: "Alerts",
    icon: Flame,
    color: "bg-gradient-to-br from-rose-400 to-red-700",
  },
];

export function KitchenLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </div>
          <div className="hidden text-sm font-semibold leading-tight sm:block">{title}</div>
        </div>
        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search orders, items, or staff..."
            className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => navigate({ to: "/kitchen-notifications" })}
          className="ml-auto relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-destructive"></span>
        </button>
        <ThemeToggle />
        <span className="rounded bg-emerald-600/20 px-2 py-1 text-[10px] font-bold text-emerald-400">
          {user?.name ?? "Chef"}
        </span>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>
      <main className="w-full flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-8">{children}</main>
      <BottomNav items={kitchenNav} />
    </div>
  );
}

function Kitchen() {
  const allOrders = useStore((s) => s.orders);
  const user = typeof window !== "undefined" ? getCurrentUser() : null;
  const [now, setNow] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("All");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const availableSlots = useMemo(
    () => Array.from(new Set(allOrders.map((o) => o.slot))),
    [allOrders]
  );

  const orders = useMemo(
    () =>
      allOrders
        .filter((order) => ["Pending", "Preparing", "Ready"].includes(order.status))
        .filter((order) => selectedSlot === "All" || order.slot === selectedSlot)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [allOrders, selectedSlot],
  );

  if (user?.role && user.role !== "kitchen") {
    return (
      <KitchenLayout title="Kitchen Access">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-bold">Kitchen dashboard is restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only kitchen staff can update order preparation status.
          </p>
        </div>
      </KitchenLayout>
    );
  }

  const counts = {
    placed: orders.filter((order) => order.status === "Pending").length,
    preparing: orders.filter((order) => order.status === "Preparing").length,
    ready: orders.filter((order) => order.status === "Ready").length,
  };

  return (
    <KitchenLayout title="Live Orders">
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <KitchenStat label="Order Placed" value={counts.placed} icon={Package} />
        <KitchenStat label="Preparing" value={counts.preparing} icon={UtensilsCrossed} />
        <KitchenStat label="Ready to Pick" value={counts.ready} icon={CheckCircle2} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold">Live Orders</div>
            <div className="text-xs text-muted-foreground">
              Auto-refreshing from employee orders and cancellations
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="rounded-md border border-border bg-muted/50 px-3 py-1 outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="All">All Slots</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <span className="rounded-md bg-primary/15 px-3 py-1 font-semibold text-primary">
              {orders.length} ACTIVE
            </span>
            <span className="rounded-md bg-muted px-3 py-1 font-semibold">
              UPDATED {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <ChefHat className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No active orders</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              New employee orders will appear here automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border md:hidden">
              {orders.map((order) => (
                <KitchenOrderCard key={order.id} order={order} now={now} />
              ))}
            </div>

            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-[10px] tracking-wider text-muted-foreground">
                  <th className="px-3 py-2">ORDER ID</th>
                  <th className="px-3 py-2">EMPLOYEE</th>
                  <th className="px-3 py-2">SLOT</th>
                  <th className="px-3 py-2">ITEMS</th>
                  <th className="px-3 py-2">TOTAL TIME</th>
                  <th className="px-3 py-2">TOTAL</th>
                  <th className="px-3 py-2">STATUS</th>
                  <th className="px-3 py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const next = nextStatus(order.status);
                  return (
                    <tr key={order.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-3 text-xs text-primary">{order.orderNumber}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-700 text-[9px] font-bold text-white">
                            {initials(order.customerName)}
                          </div>
                          {order.customerName}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{order.slot}</td>
                      <td className="px-3 py-3 text-xs">{orderItems(order)}</td>
                      <td className="px-3 py-3 font-mono text-xs">{elapsed(order, now)}</td>
                      <td className="px-3 py-3 text-xs font-semibold">{formatINR(order.total)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusColor(order.status)}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          disabled={!next}
                          onClick={() => next && updateOrderStatus(order.id, next)}
                          className="rounded-md bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground disabled:opacity-50"
                        >
                          {actionLabel(order.status)}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </KitchenLayout>
  );
}

function KitchenOrderCard({ order, now }: { order: Order; now: Date }) {
  const next = nextStatus(order.status);
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-primary">{order.orderNumber}</div>
          <div className="mt-1 text-sm font-semibold">{order.customerName}</div>
          <div className="text-xs text-muted-foreground">
            {order.department} - {order.slot}
          </div>
        </div>
        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusColor(order.status)}`}>
          {statusLabel(order.status)}
        </span>
      </div>
      <div className="text-xs">{orderItems(order)}</div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">{elapsed(order, now)}</span>
        <button
          disabled={!next}
          onClick={() => next && updateOrderStatus(order.id, next)}
          className="rounded-md bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground disabled:opacity-50"
        >
          {actionLabel(order.status)}
        </button>
      </div>
    </div>
  );
}

function KitchenStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Package;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold text-primary">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function elapsed(order: Order, now: Date) {
  const diff = Math.max(0, now.getTime() - new Date(order.createdAt).getTime());
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function orderItems(order: Order) {
  return order.items.map((item) => `${item.qty}x ${item.name}`).join(", ");
}

function statusLabel(status: OrderStatus) {
  return status === "Pending"
    ? "ORDER PLACED"
    : status === "Ready"
      ? "READY TO PICK"
      : status.toUpperCase();
}

function statusColor(status: OrderStatus) {
  return status === "Pending"
    ? "bg-warning/20 text-warning"
    : status === "Preparing"
      ? "bg-primary/15 text-primary"
      : "bg-success/15 text-success";
}

function nextStatus(status: OrderStatus): OrderStatus | null {
  return status === "Pending"
    ? "Preparing"
    : status === "Preparing"
      ? "Ready"
      : status === "Ready"
        ? "Delivered"
        : null;
}

function actionLabel(status: OrderStatus) {
  return status === "Pending"
    ? "Start Preparing"
    : status === "Preparing"
      ? "Mark Ready"
      : "Mark Delivered";
}
