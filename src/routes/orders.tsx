import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Check, UtensilsCrossed, ShoppingBag, Download, Plus } from "lucide-react";

export const Route = createFileRoute("/orders")({ component: Orders });

function Orders() {
  const steps = [
    { label: "Placed", done: true },
    { label: "Preparing", current: true, icon: UtensilsCrossed },
    { label: "Ready", done: false, icon: ShoppingBag },
  ];

  const history = [
    { date: "Oct 24, 2023", time: "1:15 PM", meal: "Standard Lunch", items: "Chicken Biryani, Raita, Gulab Ja...", amt: "₹240.00", status: "Collected", action: "Reorder" },
    { date: "Oct 23, 2023", time: "8:30 AM", meal: "Breakfast Combo", items: "Masala Dosa, Filter Coffee, Vad...", amt: "₹120.00", status: "Collected", action: "Reorder" },
    { date: "Oct 22, 2023", time: "2:45 PM", meal: "Custom Platter", items: "Garden Salad, Fruit Bowl, Juice", amt: "₹310.00", status: "Cancelled", action: "Details" },
  ];

  return (
    <AppLayout title="" brand="Canteen Management" brandSub="CORPORATE HUB" user={{ name: "Alex Carter", role: "EMPLOYEE ID 2912" }}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your active meals and track order history.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted">
          <Download className="h-3.5 w-3.5" /> Export Report
        </button>
      </div>

      {/* Active priority order */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">CURRENT PRIORITY</span>
          <span className="text-xs text-muted-foreground">#CMS-AAX9G2</span>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_2fr_1fr] md:items-center">
          <div>
            <div className="text-xl font-bold">Lunch — Veg Thali</div>
            <div className="mt-1 text-xs text-muted-foreground">Station 4 • Order placed at 12:15 PM</div>
            <span className="mt-3 inline-block rounded bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">⏱ PREPARING</span>
          </div>
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const Icon = s.icon ?? Check;
              return (
                <div key={s.label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        s.current ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : s.done ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs ${s.current ? "text-primary font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`mx-1 h-0.5 flex-1 ${s.done ? "bg-primary" : "bg-muted"}`} />}
                </div>
              );
            })}
          </div>
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-center">
            <div className="text-[10px] tracking-widest text-muted-foreground">ESTIMATED READY</div>
            <div className="text-3xl font-bold text-primary">12:45 <span className="text-base">PM</span></div>
            <div className="mt-1 text-[10px] text-muted-foreground">⏱ Approx. 12 min left</div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-semibold">Order History</div>
          <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
            <button className="rounded bg-primary px-3 py-1 text-primary-foreground">All</button>
            <button className="px-3 py-1 text-muted-foreground">Collected</button>
            <button className="px-3 py-1 text-muted-foreground">Cancelled</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Meal Type</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.date + h.meal} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-4">
                    <div>{h.date}</div>
                    <div className="text-xs text-muted-foreground">{h.time}</div>
                  </td>
                  <td className="px-4 py-4">{h.meal}</td>
                  <td className="px-4 py-4 text-muted-foreground">{h.items}</td>
                  <td className="px-4 py-4 font-semibold">{h.amt}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded px-2 py-1 text-[10px] font-semibold ${h.status === "Collected" ? "bg-info/20 text-info" : "bg-destructive text-destructive-foreground"}`}>
                      {h.status === "Collected" ? "✓ Collected" : "Cancelled"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-semibold text-primary">{h.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
          <span>Showing 1 to 3 of 42 orders</span>
          <div className="flex gap-1">
            <button className="rounded border border-border px-2 py-1">‹</button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={`rounded px-2 py-1 ${n === 1 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{n}</button>
            ))}
            <span className="px-1">…</span>
            <button className="rounded border border-border px-2 py-1">14</button>
            <button className="rounded border border-border px-2 py-1">›</button>
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 left-6 hidden items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg md:flex">
        <Plus className="h-4 w-4" /> Place New Order
      </button>
    </AppLayout>
  );
}
