import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Wallet,
  ShoppingBag,
  XCircle,
  Calendar,
  Check,
  UtensilsCrossed,
  Clock,
  FileText,
  ShoppingCart,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const steps = [
    { label: "Placed", done: true },
    { label: "Accepted", done: true },
    { label: "Preparing", current: true },
    { label: "Ready", done: false },
    { label: "Collected", done: false },
  ];

  const slots = [
    { name: "Morning Tea", time: "09:30 AM - 10:30 AM", status: "EXPIRED", action: "Slot Closed", disabled: true },
    { name: "Lunch Special", time: "12:30 PM - 02:30 PM", status: "OPEN NOW", action: "Order Now", primary: true, ends: "Ends in 01:06:23" },
    { name: "Evening Snacks", time: "04:30 PM - 05:30 PM", status: "UPCOMING", action: "Pre-order" },
    { name: "Dinner Buffet", time: "08:00 PM - 10:00 PM", status: "UPCOMING", action: "Pre-order" },
  ];

  const orders = [
    { id: "CMS-913894", item: "Classic Paneer Tikka Wrap", cat: "Lunch", amt: "₹145", status: "COMPLETED", color: "text-success" },
    { id: "CMS-CPV261", item: "Masala Chai + Samosa (2)", cat: "Morning Tea", amt: "₹65", status: "COMPLETED", color: "text-success" },
    { id: "CMS-AED4V7", item: "Spicy Chicken Bowl", cat: "Dinner", amt: "₹210", status: "CANCELLED", color: "text-destructive" },
    { id: "CMS-256103", item: "Mediterranean Salad", cat: "Lunch", amt: "₹180", status: "COMPLETED", color: "text-success" },
    { id: "CMS-MJ12M5", item: "Iced Americano", cat: "Evening Tea", amt: "₹120", status: "COMPLETED", color: "text-success" },
  ];

  return (
    <AppLayout>
      {/* Hero greeting */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-6">
          <h1 className="text-2xl font-bold">Good morning, Garth! 👋</h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
            <Calendar className="h-3.5 w-3.5" /> Thursday, October 24, 2024
          </div>
        </div>
        <div className="grid gap-3">
          <StatCard icon={Wallet} label="THIS MONTH SPENDING" value="₹1,240" />
          <StatCard icon={ShoppingBag} label="ORDERS PLACED" value="18" />
          <StatCard icon={XCircle} label="CANCELLED" value="2" iconColor="text-destructive" />
        </div>
      </div>

      {/* Active order tracker */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">Active Order</div>
            <div className="text-xs text-primary">ID: CMS-AAX9G2</div>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">● PREPARING</span>
        </div>
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    s.current
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : s.done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.current ? <UtensilsCrossed className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </div>
                <span className={`text-xs ${s.current ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 ${s.done ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Meal slots */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-semibold">Available Meal Slots</div>
          <div className="text-xs text-muted-foreground">Current: 11:24 AM</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {slots.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                    s.status === "OPEN NOW"
                      ? "bg-primary text-primary-foreground"
                      : s.status === "EXPIRED"
                      ? "bg-muted text-muted-foreground"
                      : "bg-info/20 text-info"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.time}</div>
              {s.ends && (
                <div className="mt-2 flex items-center gap-1 text-[11px] text-primary">
                  <Clock className="h-3 w-3" /> {s.ends}
                </div>
              )}
              <button
                disabled={s.disabled}
                className={`mt-4 w-full rounded-md py-2 text-xs font-semibold ${
                  s.primary
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : s.disabled
                    ? "bg-muted text-muted-foreground"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {s.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-semibold">Recent Orders</div>
          <a className="text-xs text-primary hover:underline" href="#">View All History</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">ORDER ID</th>
                <th className="px-4 py-3">ITEM NAME</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">AMOUNT</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-xs text-primary">{o.id}</td>
                  <td className="px-4 py-3">{o.item}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.cat}</td>
                  <td className="px-4 py-3">{o.amt}</td>
                  <td className={`px-4 py-3 text-xs font-semibold ${o.color}`}>{o.status}</td>
                  <td className="px-4 py-3"><FileText className="h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating cart */}
      <button className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <ShoppingCart className="h-5 w-5" />
      </button>
    </AppLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-muted ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}
