import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ShoppingBag, IndianRupee } from "lucide-react";
import { AdminLayout } from "./admin-orders";
import { useStore, formatINR, type OrderStatus } from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const orders = useStore((s) => s.orders);

  const today = new Date().toISOString().slice(0, 10);
  const todays = useMemo(
    () => orders.filter((o) => o.createdAt.slice(0, 10) === today && o.status !== "Cancelled"),
    [orders, today],
  );

  const todayRevenue = todays.reduce((s, o) => s + o.total, 0);

  const stats = [
    { icon: ShoppingBag, label: "Today's Orders", value: String(todays.length), color: "text-primary" },
    { icon: IndianRupee, label: "Today's Revenue", value: formatINR(todayRevenue), color: "text-success" },
  ];

  // Status distribution (live orders only)
  const live = useMemo(
    () => orders.filter((o) => o.status !== "Cancelled" && o.status !== "Completed"),
    [orders],
  );
  const liveByStatus = useMemo(() => {
    const tally: Record<OrderStatus, number> = {
      Pending: 0, Preparing: 0, Ready: 0, Delivered: 0, Completed: 0, Cancelled: 0,
    };
    for (const o of live) tally[o.status]++;
    return tally;
  }, [live]);

  // Top items by quantity
  const topItems = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders) {
      if (o.status === "Cancelled") continue;
      for (const it of o.items) counts.set(it.name, (counts.get(it.name) ?? 0) + it.qty);
    }
    const arr = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const max = arr[0]?.[1] ?? 1;
    return arr.map(([name, qty]) => ({ name, qty, pct: Math.round((qty / max) * 100) }));
  }, [orders]);

  // Order volume by slot
  const slotCounts = useMemo(() => {
    const slots = ["Breakfast", "Lunch", "Snacks", "Dinner"];
    const tally = Object.fromEntries(slots.map((s) => [s, 0])) as Record<string, number>;
    for (const o of orders) {
      if (o.status === "Cancelled") continue;
      if (tally[o.slot] !== undefined) tally[o.slot]++;
    }
    const max = Math.max(...Object.values(tally), 1);
    return slots.map((s) => ({ slot: s, count: tally[s], pct: Math.round((tally[s] / max) * 100) }));
  }, [orders]);

  return (
    <AdminLayout crumb="Dashboard">
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-md bg-muted ${s.color}`}><s.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 font-semibold">Order Volume by Slot</div>
          <div className="flex h-40 items-end gap-3">
            {slotCounts.map((s) => (
              <div key={s.slot} className="flex flex-1 flex-col items-center gap-1">
                <div className="text-[10px] font-bold text-muted-foreground">{s.count}</div>
                <div className="w-full rounded-t bg-primary transition-all" style={{ height: `${Math.max(s.pct, 4)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 text-center text-[10px] text-muted-foreground">
            {slotCounts.map((s) => <span key={s.slot}>{s.slot.toUpperCase()}</span>)}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 font-semibold">Live Status</div>
          <div className="space-y-3">
            <Bar label="Pending" value={liveByStatus.Pending} color="bg-foreground/40" total={live.length} />
            <Bar label="Preparing" value={liveByStatus.Preparing} color="bg-warning" total={live.length} />
            <Bar label="Ready" value={liveByStatus.Ready} color="bg-info" total={live.length} />
            <Bar label="Delivered" value={liveByStatus.Delivered} color="bg-success" total={live.length} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 font-semibold">Top Ordered Items</div>
        {topItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="space-y-3">
            {topItems.map((t) => (
              <div key={t.name}>
                <div className="flex justify-between text-xs"><span>{t.name}</span><span className="text-muted-foreground">{t.qty} orders</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${t.pct}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs"><span>{label}</span><span className="text-muted-foreground">{value} ({pct}%)</span></div>
      <div className="mt-1 h-1.5 rounded-full bg-muted"><div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
