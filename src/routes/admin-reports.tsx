import { createFileRoute } from "@tanstack/react-router";
import { Download, Bell, Settings, Calendar, ChevronDown } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-reports")({ component: AdminReports });

function AdminReports() {
  const stats = [
    { label: "Total Orders", value: "12,845", delta: "+12.4%", up: true },
    { label: "Revenue", value: "$84,290", delta: "+8.1%", up: true },
    { label: "Avg Order Value", value: "$6.56", delta: "-1.2%", up: false },
    { label: "Cancelled %", value: "0.82%", delta: "-0.4%", up: true },
  ];

  const topItems = [
    { name: "Grilled Chicken Salad", orders: "2,488 orders", val: 92 },
    { name: "Beef Teriyaki Bowl", orders: "1,920 orders", val: 78 },
    { name: "Vegan Pasta Primavera", orders: "1,540 orders", val: 64 },
    { name: "Classic Cheeseburger", orders: "1,210 orders", val: 50 },
  ];

  const deptColors = [
    { label: "Engineering (40%)", color: "bg-primary" },
    { label: "Marketing (25%)", color: "bg-purple-500" },
    { label: "Sales (20%)", color: "bg-amber-500" },
    { label: "Others (15%)", color: "bg-info" },
  ];

  // Sparkline points for spend trend (smooth-ish curve)
  const points = [80, 70, 90, 65, 110, 95, 130, 115, 150, 135, 175, 160, 200];
  const max = Math.max(...points);
  const w = 800;
  const h = 200;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 20) - 10}`)
    .join(" ");
  const fillPath = `${path} L ${w} ${h} L 0 ${h} Z`;

  // Peak hour density grid
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];
  const density = [
    [0.3, 0.9, 0.5, 0.2],
    [0.4, 1.0, 0.6, 0.3],
    [0.3, 0.85, 0.45, 0.2],
    [0.5, 0.95, 0.7, 0.35],
    [0.6, 1.0, 0.75, 0.4],
  ];

  return (
    <AdminLayout crumb="Reports">
      {/* Page header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Reports & Insights</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs">
            <Calendar className="h-3 w-3" /> Oct 01, 2023 — Oct 31, 2023 <ChevronDown className="h-3 w-3" />
          </button>
          <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Download className="h-3 w-3" /> Download Data
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card">
            <Bell className="h-3 w-3 text-muted-foreground" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card">
            <Settings className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-3xl font-bold">{s.value}</div>
              <div
                className={`mb-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  s.up ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                }`}
              >
                {s.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spend Trend chart */}
      <div className="mb-5 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="font-semibold">Spend Trend</div>
            <div className="text-[11px] text-muted-foreground">
              Monthly expenditure over the last 30 days
            </div>
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-background/40 p-0.5 text-xs">
            <button className="rounded px-3 py-1 text-muted-foreground">Weekly</button>
            <button className="rounded bg-primary px-3 py-1 font-semibold text-primary-foreground">
              Monthly
            </button>
          </div>
        </div>
        <div className="h-56">
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.74 0.17 60)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="oklch(0.74 0.17 60)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={fillPath} fill="url(#spendFill)" />
            <path d={path} fill="none" stroke="oklch(0.74 0.17 60)" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span>
        </div>
      </div>

      {/* Lower row: top items + consumption */}
      <div className="mb-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 font-semibold">Top Selling Items</div>
          <div className="space-y-3">
            {topItems.map((it) => (
              <div key={it.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{it.name}</span>
                  <span className="text-muted-foreground">{it.orders}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${it.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 font-semibold">Consumption by Dept.</div>
          <div className="flex items-center justify-center">
            <div
              className="relative flex h-32 w-32 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(oklch(0.74 0.17 60) 0% 40%, oklch(0.7 0.2 320) 40% 65%, oklch(0.78 0.17 80) 65% 85%, oklch(0.7 0.15 240) 85% 100%)`,
              }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card">
                <span className="text-lg font-bold">100%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1 text-[10px]">
            {deptColors.map((d) => (
              <div key={d.label} className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-sm ${d.color}`} />
                <span className="text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hour Density */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-1 font-semibold">Peak Hour Density</div>
        <div className="mb-4 text-[11px] text-muted-foreground">Visualizing kitchen traffic across the week</div>

        <div className="flex">
          <div className="flex flex-col justify-between pr-3 text-[10px] text-muted-foreground">
            {hours.map((h) => <span key={h}>{h}</span>)}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-2">
              {days.map((day, dIdx) => (
                <div key={day} className="grid grid-rows-4 gap-2">
                  {density[dIdx].map((v, hIdx) => (
                    <div
                      key={hIdx}
                      className="h-10 rounded-md"
                      style={{
                        backgroundColor: `oklch(0.74 0.17 60 / ${0.15 + v * 0.75})`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2 text-center text-[10px] text-muted-foreground">
              {days.map((d) => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-1 rounded-md border border-border bg-background/40 p-0.5 text-[10px]">
          <button className="rounded bg-primary px-3 py-1 font-semibold text-primary-foreground">Admin</button>
          <button className="rounded px-3 py-1 text-muted-foreground">Kitchen</button>
          <button className="rounded px-3 py-1 text-muted-foreground">Employee</button>
        </div>
      </div>
    </AdminLayout>
  );
}
