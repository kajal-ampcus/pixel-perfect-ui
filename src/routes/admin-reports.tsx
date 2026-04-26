import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, TrendingUp, Users, IndianRupee } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-reports")({ component: AdminReports });

function AdminReports() {
  const reports = [
    { name: "Monthly Revenue Report", desc: "Detailed revenue breakdown by department and slot", icon: IndianRupee, color: "text-success" },
    { name: "Employee Consumption", desc: "Per-employee meal consumption analytics", icon: Users, color: "text-info" },
    { name: "Menu Performance", desc: "Top-performing items and category trends", icon: TrendingUp, color: "text-primary" },
    { name: "Slot Utilization", desc: "Capacity usage across meal slots", icon: BarChart3, color: "text-warning" },
  ];

  return (
    <AdminLayout crumb="Reports">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground">Generate and download detailed operational reports</p>
        </div>
        <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Download className="h-3 w-3" /> Export All</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] tracking-widest text-muted-foreground">TOTAL REVENUE (MTD)</div>
          <div className="mt-1 text-3xl font-bold">₹4.82L</div>
          <div className="text-[10px] text-success">↗ +18.4% vs last month</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] tracking-widest text-muted-foreground">ORDERS PROCESSED</div>
          <div className="mt-1 text-3xl font-bold">12,847</div>
          <div className="text-[10px] text-success">↗ +9.2% vs last month</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] tracking-widest text-muted-foreground">AVG ORDER VALUE</div>
          <div className="mt-1 text-3xl font-bold">₹187</div>
          <div className="text-[10px] text-warning">↘ -2.1% vs last month</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between"><div className="font-semibold">Revenue Trend</div><select className="rounded border border-border bg-card px-2 py-1 text-xs"><option>Last 30 days</option></select></div>
        <div className="flex h-48 items-end gap-2">
          {[40, 65, 50, 80, 60, 90, 75, 85, 70, 95, 80, 100].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-gradient-to-t from-primary to-primary/40" style={{ height: `${h}%` }} />
              <span className="text-[9px] text-muted-foreground">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <div key={r.name} className="flex items-start justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-muted ${r.color}`}><r.icon className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">{r.desc}</div>
              </div>
            </div>
            <button className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs"><Download className="h-3 w-3" /> CSV</button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
