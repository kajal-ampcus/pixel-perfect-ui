import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, Clock, Users, Wallet, BarChart3, Bell,
  ShoppingBag, IndianRupee, UserCheck, AlertTriangle, Search, Download, LogOut, HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const stats = [
    { icon: ShoppingBag, label: "Today's Orders", value: "247", delta: "+12%", color: "text-primary" },
    { icon: IndianRupee, label: "Today's Revenue", value: "₹18,430", delta: "+8.2%", color: "text-success" },
    { icon: UserCheck, label: "Active Employees", value: "184", color: "text-info" },
    { icon: AlertTriangle, label: "Pending Approvals", value: "7", color: "text-warning" },
  ];

  const live = [
    { id: "#ORD-9601", emp: "Sandi Chen", dept: "Engg", item: "South Indian Thali", amt: "₹180", status: "PREPARING", color: "bg-primary text-primary-foreground" },
    { id: "#ORD-9587", emp: "Sandy Joshira", dept: "Sales", item: "Grilled Chicken Salad", amt: "₹220", status: "READY", color: "bg-emerald-600 text-white" },
  ];

  const top = [
    { name: "Chicken Oven Biryani", count: "127 orders", val: 90 },
    { name: "South Indian Platter", count: "98 orders", val: 75 },
    { name: "Garden Fresh Salad", count: "76 orders", val: 55 },
  ];

  const dept = [
    { name: "ENGINEERING", val: 90, color: "bg-primary" },
    { name: "MARKETING", val: 70, color: "bg-amber-700" },
    { name: "SALES", val: 60, color: "bg-emerald-500" },
    { name: "HR", val: 40, color: "bg-info" },
    { name: "FINANCE", val: 30, color: "bg-pink-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <div className="mb-6 rounded-lg bg-primary/15 p-3">
          <div className="text-sm font-bold text-primary">Admin Console</div>
          <div className="text-[10px] tracking-widest text-muted-foreground">CORPORATE</div>
        </div>
        <SidebarSection label="OVERVIEW" items={[{ label: "Dashboard", icon: LayoutDashboard, active: true }]} />
        <SidebarSection label="MANAGEMENT" items={[
          { label: "Menu & Orders", icon: ClipboardList },
          { label: "Time Slots", icon: Clock },
          { label: "Employees", icon: Users },
        ]} />
        <SidebarSection label="FINANCE" items={[
          { label: "Monthly Billing", icon: Wallet },
          { label: "Reports", icon: BarChart3 },
        ]} />
        <SidebarSection label="SYSTEM" items={[{ label: "Notifications", icon: Bell }]} />
        <div className="mt-auto space-y-1">
          <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground"><HelpCircle className="h-4 w-4" /> Support</Link>
          <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground"><LogOut className="h-4 w-4" /> Logout</Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card/40 px-6">
          <div className="text-xs text-muted-foreground">Home / <span className="text-foreground">Dashboard</span></div>
          <div className="relative mx-auto max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search across reports..." className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm outline-none" />
          </div>
          <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Download className="h-3 w-3" /> EXPORT</button>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-semibold">Alex Forrest</div>
              <div className="text-[10px] text-muted-foreground">SUPER ADMIN</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-md bg-muted ${s.color}`}><s.icon className="h-4 w-4" /></div>
                  {s.delta && <span className="rounded bg-success/20 px-1.5 py-0.5 text-[10px] font-bold text-success">{s.delta}</span>}
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
                {[60, 90, 75, 50, 80].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center">
                    <div className="w-full rounded-t bg-primary" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-5 text-center text-[10px] text-muted-foreground">
                <span>BREAKFAST</span><span>LUNCH</span><span>SNACKS</span><span>DINNER</span><span>LATE</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 font-semibold">Status Distribution</div>
              <div className="flex items-center justify-center gap-6">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-conic from-primary via-emerald-500 to-info">
                  <div className="absolute inset-3 flex items-center justify-center rounded-full bg-card">
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <Legend color="bg-primary" label="Collected (52%)" />
                  <Legend color="bg-emerald-500" label="Preparing (22%)" />
                  <Legend color="bg-info" label="Ready (18%)" />
                  <Legend color="bg-destructive" label="Cancelled (3%)" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="font-semibold">Live Order Board</div>
              <a className="text-xs text-primary" href="#">View all →</a>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-[10px] tracking-wider text-muted-foreground">
                <th className="px-3 py-2">ID</th><th className="px-3 py-2">EMPLOYEE</th><th className="px-3 py-2">DEPT</th>
                <th className="px-3 py-2">ITEM</th><th className="px-3 py-2">TOTAL</th><th className="px-3 py-2">STATUS</th><th className="px-3 py-2">ACTIONS</th>
              </tr></thead>
              <tbody>
                {live.map((o) => (
                  <tr key={o.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-3 text-xs text-primary">{o.id}</td>
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-amber-700" />{o.emp}</div></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{o.dept}</td>
                    <td className="px-3 py-3 text-xs">{o.item}</td>
                    <td className="px-3 py-3 font-semibold">{o.amt}</td>
                    <td className="px-3 py-3"><span className={`rounded px-2 py-0.5 text-[10px] font-bold ${o.color}`}>{o.status}</span></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">⋯</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 font-semibold">Top Ordered Items</div>
              <div className="space-y-3">
                {top.map((t) => (
                  <div key={t.name}>
                    <div className="flex justify-between text-xs"><span>{t.name}</span><span className="text-muted-foreground">{t.count}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${t.val}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 font-semibold">Department Consumption</div>
              <div className="space-y-2">
                {dept.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-24 text-[10px] text-muted-foreground">{d.name}</span>
                    <div className="h-3 flex-1 rounded-full bg-muted"><div className={`h-3 rounded-full ${d.color}`} style={{ width: `${d.val}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarSection({ label, items }: { label: string; items: { label: string; icon: typeof Users; active?: boolean }[] }) {
  return (
    <div className="mb-3">
      <div className="mb-1 px-3 text-[10px] tracking-widest text-muted-foreground">{label}</div>
      {items.map((it) => (
        <div key={it.label} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${it.active ? "bg-sidebar-active text-primary border-r-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-active/60"}`}>
          <it.icon className="h-4 w-4" />{it.label}
        </div>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</div>;
}
