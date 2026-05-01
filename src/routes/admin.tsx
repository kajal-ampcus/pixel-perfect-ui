import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { IndianRupee, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import { CategoryChartType } from "igniteui-react-charts";
import {
  IgniteCategoryChartCard,
  IgniteDonutChartCard,
} from "@/components/charts/IgniteDashboardCharts";
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

  const todayRevenue = todays.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      icon: ShoppingBag,
      label: "Today's Orders",
      value: String(todays.length),
      color: "text-primary",
    },
    {
      icon: IndianRupee,
      label: "Today's Revenue",
      value: formatINR(todayRevenue),
      color: "text-success",
    },
  ];

  const live = useMemo(
    () => orders.filter((o) => o.status !== "Cancelled" && o.status !== "Completed"),
    [orders],
  );

  const liveByStatus = useMemo(() => {
    const tally: Record<OrderStatus, number> = {
      Pending: 0,
      Preparing: 0,
      Ready: 0,
      Delivered: 0,
      Completed: 0,
      Cancelled: 0,
    };

    for (const order of live) {
      tally[order.status]++;
    }

    return tally;
  }, [live]);

  const topItems = useMemo(() => {
    const counts = new Map<string, number>();

    for (const order of orders) {
      if (order.status === "Cancelled") continue;
      for (const item of order.items) {
        counts.set(item.name, (counts.get(item.name) ?? 0) + item.qty);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
  }, [orders]);

  const slotCounts = useMemo(() => {
    const slots = ["Snacks", "Dinner", "Late Night Snacks"];
    const tally = Object.fromEntries(slots.map((slot) => [slot, 0])) as Record<string, number>;

    for (const order of orders) {
      if (order.status === "Cancelled") continue;
      if (tally[order.slot] !== undefined) {
        tally[order.slot]++;
      }
    }

    return slots.map((slot) => ({
      slot,
      orders: tally[slot],
    }));
  }, [orders]);

  const liveStatusData = [
    { status: "Pending", count: liveByStatus.Pending },
    { status: "Preparing", count: liveByStatus.Preparing },
    { status: "Ready", count: liveByStatus.Ready },
    { status: "Delivered", count: liveByStatus.Delivered },
  ].filter((item) => item.count > 0);

  const activeStatusCount = liveStatusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <AdminLayout crumb="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[28px] border border-border bg-card p-5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-muted ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                  Live
                </span>
              </div>
              <div className="mt-4 text-3xl font-black tracking-tight">{stat.value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
          <section className="rounded-[30px] border border-[#f0e1cf] bg-card p-5 shadow-[0_24px_60px_-36px_rgba(204,120,40,0.35)]">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.24em]">
                    Demand Pulse
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-black tracking-tight">Order Volume by Slot</h2>
                <p className="text-sm text-muted-foreground">
                  A smoother view of how traffic moves across the day.
                </p>
              </div>
              <div className="rounded-2xl bg-[#fff5ea] px-4 py-3 text-right">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c7772d]">
                  Peak Window
                </div>
                <div className="mt-1 text-lg font-black text-[#2c1a0e]">
                  {
                    slotCounts.reduce(
                      (best, current) => (current.orders > best.orders ? current : best),
                      slotCounts[0],
                    ).slot
                  }
                </div>
              </div>
            </div>

            <IgniteCategoryChartCard
              data={slotCounts}
              chartType={CategoryChartType.SplineArea}
              height="290px"
              brushes={["#f97316", "#fb923c", "#fdba74"]}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {slotCounts.map((slot) => (
                <div key={slot.slot} className="rounded-2xl bg-[#fff9f2] px-4 py-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {slot.slot}
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#2c1a0e]">{slot.orders}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-[#efe2d3] bg-card p-5 shadow-[0_24px_60px_-36px_rgba(86,72,46,0.28)]">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[#7c5cff]">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.24em]">Live Mix</span>
                </div>
                <h2 className="mt-2 text-xl font-black tracking-tight">Status Distribution</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time breakdown of orders in the active pipeline.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7f2ff] px-4 py-3 text-right">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c5cff]">
                  Active Orders
                </div>
                <div className="mt-1 text-3xl font-black text-[#24153c]">{activeStatusCount}</div>
              </div>
            </div>

            {liveStatusData.length === 0 ? (
              <div className="rounded-2xl bg-[#fffaf6] py-16 text-center text-sm text-muted-foreground">
                No active orders right now.
              </div>
            ) : (
              <>
                <IgniteDonutChartCard
                  data={liveStatusData}
                  valueMemberPath="count"
                  labelMemberPath="status"
                  height="290px"
                  brushes={["#9ca3af", "#f59e0b", "#0ea5e9", "#22c55e"]}
                />

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {liveStatusData.map((status) => (
                    <div key={status.status} className="rounded-2xl bg-[#fff9f2] px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {status.status}
                      </div>
                      <div className="mt-1 text-2xl font-black text-[#2c1a0e]">{status.count}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        <section className="rounded-[30px] border border-[#f0e1cf] bg-card p-5 shadow-[0_24px_60px_-36px_rgba(204,120,40,0.22)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.24em]">Menu Winners</span>
              </div>
              <h2 className="mt-2 text-xl font-black tracking-tight">Top Ordered Items</h2>
              <p className="text-sm text-muted-foreground">
                Best-performing dishes across all non-cancelled orders.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fff5ea] px-4 py-3 text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c7772d]">
                Best Seller
              </div>
              <div className="mt-1 text-lg font-black text-[#2c1a0e]">
                {topItems[0]?.name ?? "N/A"}
              </div>
            </div>
          </div>

          {topItems.length === 0 ? (
            <div className="rounded-2xl bg-[#fffaf6] py-16 text-center text-sm text-muted-foreground">
              No orders yet.
            </div>
          ) : (
            <>
              <IgniteCategoryChartCard
                data={topItems}
                chartType={CategoryChartType.Column}
                height="300px"
                brushes={["#f97316", "#fb923c", "#fdba74"]}
              />

              <div className="mt-4 grid gap-3 md:grid-cols-5">
                {topItems.map((item, index) => (
                  <div key={item.name} className="rounded-2xl bg-[#fff9f2] px-4 py-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Rank {index + 1}
                    </div>
                    <div className="mt-1 line-clamp-1 text-sm font-bold text-[#2c1a0e]">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xl font-black text-primary">{item.qty}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
