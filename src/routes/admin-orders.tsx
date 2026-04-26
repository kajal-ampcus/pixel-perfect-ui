import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, Clock, Users, Wallet, BarChart3, Bell,
  ChefHat, Search, Download, LogOut, HelpCircle, Check, X, ShoppingBag, FileText,
} from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/admin-orders")({ component: AdminOrders });

export function AdminLayout({ children, crumb }: { children: ReactNode; crumb: string }) {
  const location = useLocation();
  const sections = [
    { label: "OVERVIEW", items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }, { to: "/admin-orders", label: "Live Orders", icon: ShoppingBag }] },
    { label: "MANAGEMENT", items: [{ to: "/admin-menu", label: "Menu & Items", icon: ClipboardList }, { to: "/admin-slots", label: "Time Slots", icon: Clock }, { to: "/admin-users", label: "Kitchen Users", icon: Users }] },
    { label: "FINANCE", items: [{ to: "/admin-billing", label: "Monthly Billing", icon: Wallet }, { to: "/admin-reports", label: "Reports", icon: BarChart3 }] },
    { label: "SYSTEM", items: [{ to: "/admin-notifications", label: "Notifications", icon: Bell }] },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary/15 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><ChefHat className="h-4 w-4" /></div>
          <div>
            <div className="text-sm font-bold text-primary leading-tight">Admin Console</div>
            <div className="text-[9px] tracking-widest text-muted-foreground">CENTRAL HUB</div>
          </div>
        </div>
        {sections.map((s) => (
          <div key={s.label} className="mb-3">
            <div className="mb-1 px-3 text-[10px] tracking-widest text-muted-foreground">{s.label}</div>
            {s.items.map((it) => {
              const active = location.pathname === it.to;
              return (
                <Link key={it.label} to={it.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-sidebar-active text-primary border-r-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-active/60"}`}>
                  <it.icon className="h-4 w-4" />{it.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="mt-auto space-y-1">
          <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground"><HelpCircle className="h-4 w-4" /> Support</Link>
          <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground"><LogOut className="h-4 w-4" /> Logout</Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card/40 px-6">
          <div className="text-xs text-muted-foreground">Admin / <span className="text-foreground">{crumb}</span></div>
          <div className="relative mx-auto max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search orders..." className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm outline-none" />
          </div>
          <button className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold"><Download className="h-3 w-3" /> Export CSV</button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
            <div className="text-xs"><div className="font-semibold">Chef David</div></div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function AdminOrders() {
  const stats = [
    { label: "AWAITING APPROVAL", value: "08", color: "text-primary", icon: FileText },
    { label: "IN KITCHEN", value: "14", color: "text-info", icon: ChefHat },
    { label: "REJECTED TODAY", value: "03", color: "text-destructive", icon: X },
    { label: "FULFILLED", value: "42", color: "text-success", icon: Check },
  ];
  const orders = [
    { id: "#ORD-8821", emp: "Arjun Sharma", slot: "Lunch Slot — Team Alpha", items: [{ name: "1x Paneer Butter Masala", qty: "Qty 1" }, { name: "2x Butter Naan", qty: "Qty 2" }] },
    { id: "#ORD-8819", emp: "Sarah Jenkins", slot: "Lunch Slot — Marketing", items: [{ name: "1x Quinoa Salad Bowl", qty: "Qty 1" }, { name: "1x Fresh Lime Soda", qty: "Qty 1" }] },
    { id: "#ORD-8824", emp: "Michael Chen", slot: "Late Lunch — Dev Ops", items: [{ name: "1x Grilled Chicken Wrap", qty: "Qty 1" }, { name: "1x Cold Brew Coffee", qty: "Qty 1" }] },
  ];
  return (
    <AdminLayout crumb="Order Approval">
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between text-[10px] tracking-widest text-muted-foreground">
              {s.label}<s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className={`mt-2 text-4xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-md border border-border bg-card p-1 text-xs">
          {["Awaiting Approval", "Approved", "Rejected"].map((t, i) => (
            <button key={t} className={`rounded px-4 py-1.5 ${i === 0 ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">Sort by: <span className="rounded border border-border bg-card px-2 py-1 text-foreground">Time Received</span></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-primary">{o.id}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">2m ago</span>
            </div>
            <div className="mt-1 text-[10px] font-bold text-warning">● Awaiting Approval</div>
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
            <div className="mt-4 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-success py-2 text-xs font-bold text-success-foreground"><Check className="h-3 w-3" /> Approve</button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-destructive py-2 text-xs font-bold text-destructive-foreground"><X className="h-3 w-3" /> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
