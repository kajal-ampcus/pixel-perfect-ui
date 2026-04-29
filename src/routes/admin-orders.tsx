import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Clock, Wallet, BarChart3, Bell,
  ChefHat, Search, Download, LogOut, ShoppingBag,
} from "lucide-react";
import type { ReactNode } from "react";
import { logout, getCurrentUser } from "@/lib/auth";
import { BottomNav, type BottomNavItem } from "@/components/BottomNav";

export const Route = createFileRoute("/admin-orders")({ component: AdminOrders });

const adminNav: BottomNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "bg-indigo-500" },
  { to: "/admin-orders", label: "Orders", icon: ShoppingBag, color: "bg-blue-500" },
  { to: "/admin-slots", label: "Slots", icon: Clock, color: "bg-cyan-500" },
  { to: "/admin-menu", label: "Menu", icon: ClipboardList, color: "bg-orange-500" },
  { to: "/admin-billing", label: "Billing", icon: Wallet, color: "bg-amber-500" },
  { to: "/admin-reports", label: "Reports", icon: BarChart3, color: "bg-emerald-500" },
  { to: "/admin-notifications", label: "Alerts", icon: Bell, color: "bg-rose-500" },
];

export function AdminLayout({ children, crumb }: { children: ReactNode; crumb: string }) {
  const navigate = useNavigate();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;
  const handleLogout = () => { logout(); navigate({ to: "/login" }); };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur md:px-6">
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
          <input placeholder="Search orders..." className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm outline-none" />
        </div>
        <button className="ml-auto hidden items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold sm:flex md:ml-0">
          <Download className="h-3 w-3" /> Export
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
          <div className="hidden text-xs sm:block">
            <div className="font-semibold leading-none">{user?.name ?? "Admin"}</div>
            <div className="text-[10px] text-muted-foreground">ADMIN</div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 pb-28 md:p-6 md:pb-28">{children}</main>
      <BottomNav items={adminNav} />
    </div>
  );
}

function AdminOrders() {
  const stages = ["Preparing", "Ready", "Delivered"] as const;
  type Stage = typeof stages[number];

  const initial = [
    { id: "#ORD-8821", emp: "Arjun Sharma", slot: "Lunch Slot — Team Alpha", items: [{ name: "1x Paneer Butter Masala", qty: "Qty 1" }, { name: "2x Butter Naan", qty: "Qty 2" }], stage: "Preparing" as Stage, time: "2m ago" },
    { id: "#ORD-8819", emp: "Sarah Jenkins", slot: "Lunch Slot — Marketing", items: [{ name: "1x Quinoa Salad Bowl", qty: "Qty 1" }, { name: "1x Fresh Lime Soda", qty: "Qty 1" }], stage: "Ready" as Stage, time: "5m ago" },
    { id: "#ORD-8824", emp: "Michael Chen", slot: "Late Lunch — Dev Ops", items: [{ name: "1x Grilled Chicken Wrap", qty: "Qty 1" }, { name: "1x Cold Brew Coffee", qty: "Qty 1" }], stage: "Preparing" as Stage, time: "1m ago" },
    { id: "#ORD-8815", emp: "Linda Park", slot: "Lunch Slot — Sales", items: [{ name: "1x Veg Thali", qty: "Qty 1" }], stage: "Delivered" as Stage, time: "20m ago" },
  ];

  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState<"All" | Stage>("All");

  const counts = {
    Preparing: orders.filter((o) => o.stage === "Preparing").length,
    Ready: orders.filter((o) => o.stage === "Ready").length,
    Delivered: orders.filter((o) => o.stage === "Delivered").length,
    Total: orders.length,
  };

  const advance = (id: string) => {
    setOrders((cur) =>
      cur.map((o) => {
        if (o.id !== id) return o;
        const idx = stages.indexOf(o.stage);
        return idx < stages.length - 1 ? { ...o, stage: stages[idx + 1] } : o;
      }),
    );
  };

  const stageStyle = (s: Stage) =>
    s === "Preparing"
      ? "bg-warning/20 text-warning"
      : s === "Ready"
      ? "bg-info/20 text-info"
      : "bg-success/20 text-success";

  const visible = filter === "All" ? orders : orders.filter((o) => o.stage === filter);

  return (
    <AdminLayout crumb="Live Orders">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Live Orders</h1>
        <p className="text-xs text-muted-foreground">All orders are auto-confirmed. Update status as kitchen progresses.</p>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="TOTAL TODAY" value={String(counts.Total).padStart(2, "0")} color="text-primary" />
        <Stat label="PREPARING" value={String(counts.Preparing).padStart(2, "0")} color="text-warning" />
        <Stat label="READY" value={String(counts.Ready).padStart(2, "0")} color="text-info" />
        <Stat label="DELIVERED" value={String(counts.Delivered).padStart(2, "0")} color="text-success" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-border bg-card p-1 text-xs">
          {(["All", ...stages] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded px-4 py-1.5 transition ${
                filter === t ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">Sort by: <span className="rounded border border-border bg-card px-2 py-1 text-foreground">Time Received</span></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((o) => {
          const idx = stages.indexOf(o.stage);
          const next = idx < stages.length - 1 ? stages[idx + 1] : null;
          return (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-primary">{o.id}</span>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{o.time}</span>
              </div>
              <div className={`mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${stageStyle(o.stage)}`}>● {o.stage}</div>
              <div className="mt-3">
                <div className="font-semibold">{o.emp}</div>
                <div className="text-[10px] text-muted-foreground">{o.slot}</div>
              </div>
              <div className="mt-3 space-y-1 rounded-md bg-muted/40 p-2">
                {o.items.map((it) => (
                  <div key={it.name} className="flex justify-between text-xs">
                    <span>{it.name}</span><span className="text-muted-foreground">{it.qty}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                {next ? (
                  <button
                    onClick={() => advance(o.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
                  >
                    Mark as {next}
                  </button>
                ) : (
                  <div className="rounded-md border border-success/40 bg-success/10 py-2 text-center text-xs font-bold text-success">
                    ✓ Order Delivered
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-2 text-4xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
