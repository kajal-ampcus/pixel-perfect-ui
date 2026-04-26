import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Check, Wallet, AlertTriangle, Info } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  const list = [
    {
      icon: Check, color: "bg-primary/20 text-primary",
      title: "Order Ready for Pickup",
      body: "Your order #ORD-7721 (Grilled Salmon Bowl & Iced Americano) is ready at Counter 4. Please show your QR code to the staff.",
      time: "2 mins ago", actions: true, dot: "bg-primary",
    },
    {
      icon: Wallet, color: "bg-info/20 text-info",
      title: "Wallet Auto-Top Up Successful",
      body: "Your balance has been topped up with $50.00 from your linked account. Current balance: $62.45.",
      time: "1 hour ago", dot: "bg-warning",
    },
    {
      icon: AlertTriangle, color: "bg-destructive/20 text-destructive",
      title: "System Maintenance",
      body: "Scheduled maintenance will occur on Sunday, Oct 24, from 02:00 AM to 04:00 AM. Pre-ordering will be temporarily unavailable.",
      time: "5 hours ago",
    },
    {
      icon: Info, color: "bg-blue-500/20 text-blue-400",
      title: "New Menu Items Available",
      body: "Check out the new Autumn Specials! We've added Pumpkin Spiced Latte and Roasted Root Vegetable Salad to the lunch menu.",
      time: "Yesterday",
    },
  ];

  return (
    <AppLayout title="Notifications" brand="CanteenPro" brandSub="Employee Portal">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2 rounded-md bg-muted p-1 text-xs">
          {["All", "Orders", "Wallet", "System"].map((t, i) => (
            <button key={t} className={`rounded px-4 py-1.5 ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <button className="text-xs text-primary hover:underline">✓ Mark all as read</button>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <div key={n.title} className="relative rounded-xl border border-border bg-card p-4">
            <div className="flex gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${n.color}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-[10px] text-muted-foreground">{n.time}</div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                {n.actions && (
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">View Order</button>
                    <button className="rounded-md border border-border px-3 py-1 text-[11px]">Dismiss</button>
                  </div>
                )}
              </div>
              {n.dot && <span className={`absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${n.dot}`} />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="rounded-md border border-border px-5 py-2 text-xs hover:bg-muted">Load Older Notifications</button>
      </div>
    </AppLayout>
  );
}
