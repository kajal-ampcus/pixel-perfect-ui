import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  ChefHat, ClipboardList, History, Bell, Search, HelpCircle, Settings,
  ShoppingBag, AlertTriangle, RefreshCw, Package, AlertOctagon, Filter, CheckCheck,
} from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/kitchen-notifications")({ component: KitchenNotifications });

function KitchenLayout({ children, title }: { children: ReactNode; title: string }) {
  const location = useLocation();
  const items = [
    { to: "/kitchen", label: "Live Orders", icon: ClipboardList },
    { to: "/kitchen-history", label: "Order History", icon: History },
    { to: "/kitchen-notifications", label: "Notifications", icon: Bell, badge: 3 },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary/15 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-primary leading-tight">Kitchen Portal</div>
            <div className="text-[9px] tracking-widest text-muted-foreground">STATION 04</div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon, badge }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-sidebar-active text-primary border-r-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-active/60"}`}>
                <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>
                {badge && <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{badge}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-md border border-border bg-card/40 p-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
          <div className="text-xs">
            <div className="font-semibold">Walter Adler</div>
            <div className="text-[10px] text-success">● Active</div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card/40 px-6">
          <div className="text-sm font-semibold">FrozenOMS</div>
          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            <span>Last Sync</span><span>Profile</span><span>Mason</span>
            <Search className="h-4 w-4" /><HelpCircle className="h-4 w-4" /><Settings className="h-4 w-4" />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{title && null}{children}</main>
      </div>
    </div>
  );
}

function KitchenNotifications() {
  const list = [
    { icon: ShoppingBag, color: "bg-primary/20 text-primary", type: "New Order", msg: "New Order Received #ORD-9621", sub: "Table 12 — 2× Truffle Fries, 1× Caesar Salad", time: "2 mins ago", status: "Active", statusColor: "bg-destructive text-destructive-foreground" },
    { icon: AlertTriangle, color: "bg-warning/20 text-warning", type: "Warning", msg: "Order Delay Warning #ORD-9584", sub: "Prep time exceeded standard window — escalation required.", time: "12 mins ago", status: "Active", statusColor: "bg-warning text-foreground" },
    { icon: RefreshCw, color: "bg-info/20 text-info", type: "Update", msg: "Order Modify for Pickup #ORD-9583", sub: "Add: 1x soy sauce side dish", time: "45 mins ago", status: "Resolved", statusColor: "bg-info/30 text-info" },
    { icon: Package, color: "bg-emerald-500/20 text-emerald-400", type: "New Order", msg: "New Order Received #ORD-9582", sub: "Pickup — Vegan Burger Set Meal", time: "55 mins ago", status: "Resolved", statusColor: "bg-info/30 text-info" },
    { icon: AlertOctagon, color: "bg-destructive/20 text-destructive", type: "Critical", msg: "Order Ready for Pickup #ORD-9581", sub: "Customer waiting at counter — confirm handoff.", time: "1h 0m ago", status: "Resolved", statusColor: "bg-info/30 text-info" },
  ];

  return (
    <KitchenLayout title="Notifications">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications Center</h1>
          <p className="text-xs text-muted-foreground">Managing real-time updates from across the kitchen operations.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs"><Filter className="h-3 w-3" /> Filter Alerts</button>
          <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><CheckCheck className="h-3 w-3" /> Mark All Resolved</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_2.5fr_1fr_0.8fr] border-b border-border px-4 py-2 text-[10px] tracking-wider text-muted-foreground">
          <span>TYPE</span><span>MESSAGE</span><span>TIME</span><span>STATUS</span>
        </div>
        {list.map((n, i) => (
          <div key={i} className="grid grid-cols-[1fr_2.5fr_1fr_0.8fr] items-center border-b border-border/60 px-4 py-3 last:border-0">
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${n.color}`}><n.icon className="h-3.5 w-3.5" /></div>
              <span className="text-xs font-semibold">{n.type}</span>
            </div>
            <div>
              <div className="text-xs font-semibold">{n.msg}</div>
              <div className="text-[10px] text-muted-foreground">{n.sub}</div>
            </div>
            <div className="text-xs text-muted-foreground">{n.time}</div>
            <div><span className={`rounded px-2 py-0.5 text-[10px] font-bold ${n.statusColor}`}>{n.status}</span></div>
          </div>
        ))}
        <div className="flex items-center justify-between p-3 text-xs text-muted-foreground">
          <span>Showing 5 of 12 alerts</span>
          <div className="flex gap-1">
            <button className="rounded border border-border px-2 py-0.5">‹</button>
            <button className="rounded border border-border px-2 py-0.5">›</button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/20 text-warning"><AlertTriangle className="h-5 w-5" /></div>
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground">Active Alerts</div>
              <div className="text-2xl font-bold">02</div>
              <div className="text-[10px] text-muted-foreground">Currently requiring action</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success/20 text-success"><CheckCheck className="h-5 w-5" /></div>
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground">Shift Efficiency</div>
              <div className="text-2xl font-bold">94%</div>
              <div className="text-[10px] text-muted-foreground">Resolved alerts in this shift</div>
            </div>
          </div>
        </div>
      </div>
    </KitchenLayout>
  );
}
