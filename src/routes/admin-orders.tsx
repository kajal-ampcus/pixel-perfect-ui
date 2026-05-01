import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LayoutGrid, ChefHat, Clock3, ReceiptText, Flame,
  Search, LogOut, ShoppingBag, Bell,
} from "lucide-react";
import type { ReactNode } from "react";
import { logout, getCurrentUser } from "@/lib/auth";
import { BottomNav, type BottomNavItem } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStore, formatINR, type OrderStatus } from "@/lib/store";

export const Route = createFileRoute("/admin-orders")({ component: AdminOrders });

const adminNav: BottomNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, color: "bg-gradient-to-br from-violet-400 to-indigo-600" },
  { to: "/admin-orders", label: "Orders", icon: ShoppingBag, color: "bg-gradient-to-br from-sky-400 to-blue-700" },
  { to: "/admin-slots", label: "Slots", icon: Clock3, color: "bg-gradient-to-br from-cyan-300 to-sky-700" },
  { to: "/admin-menu", label: "Menu", icon: ChefHat, color: "bg-gradient-to-br from-orange-300 to-red-500" },
  { to: "/admin-billing", label: "Billing", icon: ReceiptText, color: "bg-gradient-to-br from-amber-300 to-orange-600" },
  { to: "/admin-notifications", label: "Alerts", icon: Flame, color: "bg-gradient-to-br from-rose-400 to-red-700" },
];

export function AdminLayout({ children, crumb }: { children: ReactNode; crumb: string }) {
  const navigate = useNavigate();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;
  const unreadCount = useStore((s) => s.notifications.filter((n) => !n.read).length);
  const handleLogout = () => { logout(); navigate({ to: "/login" }); };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-primary leading-tight">Admin Portal</div>
            <div className="text-[10px] text-muted-foreground">Admin / <span className="text-foreground">{crumb}</span></div>
          </div>
        </div>
        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search..." className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm outline-none" />
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* Notification Bell */}
          <button
            onClick={() => navigate({ to: "/admin-notifications" })}
            className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
          <div className="hidden text-xs sm:block">
            <div className="font-semibold leading-none">{user?.name ?? "Admin"}</div>
            <div className="text-[10px] text-muted-foreground">ADMIN</div>
          </div>
        </div>
        <ThemeToggle />
        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </header>
      <main className="w-full flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-8">{children}</main>
      <BottomNav items={adminNav} />
    </div>
  );
}

const STAGES = ["Pending", "Preparing", "Ready", "Delivered"] as const;
type Stage = typeof STAGES[number];

function AdminOrders() {
  const orders = useStore((s) => s.orders);
  const [filter, setFilter] = useState<"All" | Stage>("All");
  const [query, setQuery] = useState("");

  const liveOrders = useMemo(
    () => orders.filter((o) => o.status !== "Completed" && o.status !== "Cancelled"),
    [orders],
  );

  const counts = useMemo(() => ({
    Pending: liveOrders.filter((o) => o.status === "Pending").length,
    Preparing: liveOrders.filter((o) => o.status === "Preparing").length,
    Ready: liveOrders.filter((o) => o.status === "Ready").length,
    Delivered: liveOrders.filter((o) => o.status === "Delivered").length,
    Total: liveOrders.length,
  }), [liveOrders]);

  const visible = useMemo(() => {
    let list = liveOrders;
    if (filter !== "All") list = list.filter((o) => o.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [liveOrders, filter, query]);

  const stageStyle = (s: OrderStatus) =>
    s === "Pending" ? "bg-muted text-foreground" :
    s === "Preparing" ? "bg-warning/20 text-warning" :
    s === "Ready" ? "bg-info/20 text-info" :
    s === "Delivered" ? "bg-success/20 text-success" :
    "bg-destructive/20 text-destructive";

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout crumb="Live Orders">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Live Orders</h1>
          <p className="text-xs text-muted-foreground">View-only. Order actions are managed by Kitchen.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order # or name..."
            className="w-full rounded-md border border-border bg-input/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary sm:w-64"
          />
        </div>
      </div>

      <div className="my-4 grid gap-3 grid-cols-2 lg:grid-cols-5">
        <Stat label="TOTAL" value={counts.Total} color="text-primary" />
        <Stat label="PENDING" value={counts.Pending} color="text-foreground" />
        <Stat label="PREPARING" value={counts.Preparing} color="text-warning" />
        <Stat label="READY" value={counts.Ready} color="text-info" />
        <Stat label="DELIVERED" value={counts.Delivered} color="text-success" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1 text-xs">
          {(["All", ...STAGES] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded px-3 py-1.5 transition ${
                filter === t ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="hidden grid-cols-[100px_1fr_100px_100px_100px_100px_90px] gap-3 border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-bold tracking-widest text-muted-foreground md:grid">
          <span>ORDER #</span>
          <span>CUSTOMER</span>
          <span>SLOT</span>
          <span>ITEMS</span>
          <span>TOTAL</span>
          <span>STATUS</span>
          <span>TIME</span>
        </div>

        {visible.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">No live orders.</div>
        )}

        {visible.map((o) => (
          <div
            key={o.id}
            className="group relative grid grid-cols-2 gap-2 border-b border-border/40 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-muted/30 md:grid-cols-[100px_1fr_100px_100px_100px_100px_90px] md:gap-3 md:items-center"
          >
            <div className="font-mono text-xs text-primary md:text-sm">#{o.orderNumber}</div>
            <div className="col-span-2 md:col-span-1">
              <div className="font-semibold">{o.customerName}</div>
              <div className="text-[10px] text-muted-foreground">{o.department}</div>
            </div>
            <div className="text-xs text-muted-foreground">{o.slot}</div>
            <div className="text-xs text-muted-foreground">{o.items.reduce((s, i) => s + i.qty, 0)} items</div>
            <div className="font-semibold">{formatINR(o.total)}</div>
            <div>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${stageStyle(o.status)}`}>● {o.status}</span>
            </div>
            <div className="text-[10px] text-muted-foreground">{formatTime(o.createdAt)}</div>

            {/* Mobile items view */}
            <div className="col-span-2 rounded-lg bg-muted/30 p-2 md:hidden">
              <div className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground">ITEMS</div>
              <ul className="space-y-1">
                {o.items.map((it) => (
                  <li key={it.itemId + it.name} className="flex items-center justify-between text-xs">
                    <span><span className="font-semibold text-primary">×{it.qty}</span> {it.name}</span>
                    <span className="text-muted-foreground">{formatINR(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hover popover */}
            <div className="pointer-events-none absolute left-4 right-4 top-full z-20 mt-1 origin-top scale-95 rounded-lg border border-border bg-popover p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 md:left-auto md:right-4 md:w-72">
              <div className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground">ITEMS ORDERED</div>
              <ul className="space-y-1">
                {o.items.map((it) => (
                  <li key={it.itemId + it.name} className="flex items-center justify-between text-xs">
                    <span><span className="font-semibold text-primary">×{it.qty}</span> {it.name}</span>
                    <span className="text-muted-foreground">{formatINR(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-xs font-bold">
                <span>Total</span>
                <span className="text-primary">{formatINR(o.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{String(value).padStart(2, "0")}</div>
    </div>
  );
}
