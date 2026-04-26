import { createFileRoute } from "@tanstack/react-router";
import { Bell, AlertTriangle, CheckCircle2, Info, ShoppingBag, Users, Wallet } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-notifications")({ component: AdminNotifications });

function AdminNotifications() {
  const items = [
    { icon: AlertTriangle, color: "text-destructive bg-destructive/15", title: "Stock running low: Paneer", desc: "Only 2kg remaining for tomorrow's lunch slot.", time: "5 min ago", tag: "URGENT" },
    { icon: ShoppingBag, color: "text-primary bg-primary/15", title: "New bulk order received", desc: "Engineering department placed 45 lunch orders.", time: "12 min ago", tag: "ORDER" },
    { icon: Users, color: "text-info bg-info/15", title: "New kitchen staff onboarded", desc: "Rajesh Kumar has joined as Junior Chef.", time: "1 hour ago", tag: "USERS" },
    { icon: Wallet, color: "text-success bg-success/15", title: "Monthly billing processed", desc: "₹1.2L deducted across 1,240 employees successfully.", time: "3 hours ago", tag: "FINANCE" },
    { icon: CheckCircle2, color: "text-success bg-success/15", title: "Reconciliation completed", desc: "All October transactions have been matched.", time: "Yesterday", tag: "FINANCE" },
    { icon: Info, color: "text-warning bg-warning/15", title: "Slot capacity warning", desc: "Lunch slot is at 95% capacity for tomorrow.", time: "Yesterday", tag: "SYSTEM" },
  ];

  return (
    <AdminLayout crumb="Notifications">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-xs text-muted-foreground">System alerts and operational updates</p>
        </div>
        <button className="rounded-md border border-border px-3 py-1.5 text-xs">Mark all as read</button>
      </div>

      <div className="mb-4 flex gap-2 text-xs">
        {["All (12)", "Unread (4)", "Urgent (2)", "Orders", "Finance", "System"].map((f, i) => (
          <button key={f} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{f}</button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        {items.map((n, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-border/40 p-4 last:border-0 hover:bg-muted/20">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${n.color}`}><n.icon className="h-4 w-4" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{n.title}</div>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-muted-foreground">{n.tag}</span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{n.desc}</div>
            </div>
            <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Bell className="h-3 w-3" /> You're all caught up
      </div>
    </AdminLayout>
  );
}
