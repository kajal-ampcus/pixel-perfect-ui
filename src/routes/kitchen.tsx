import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChefHat, ClipboardList, History, Bell, LogOut, Search, Settings, HelpCircle,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { logout, getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/kitchen")({ component: Kitchen });

function KitchenLayout({ children, title }: { children: ReactNode; title: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = typeof window !== "undefined" ? getCurrentUser() : null;
  const handleLogout = () => { logout(); navigate({ to: "/login" }); };
  const items = [
    { to: "/kitchen", label: "Live Orders", icon: ClipboardList },
    { to: "/kitchen-history", label: "Order History", icon: History },
    { to: "/kitchen-notifications", label: "Notifications", icon: Bell },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <div className="mb-6 rounded-lg bg-primary/15 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-primary">Kitchen</div>
              <div className="text-sm font-bold text-primary">Command</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">CORPORATE</div>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-sidebar-active text-primary border-r-2 border-primary" : "text-sidebar-foreground hover:bg-sidebar-active/60"}`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            );
          })}
        </nav>
        <button className="mt-4 flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground">
          <Plus className="h-3 w-3" /> Quick Manual Order
        </button>
        <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-active/60 rounded-md"><LogOut className="h-4 w-4" /> Logout</button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card/40 px-6">
          <div className="text-sm font-semibold">{title}</div>
          <div className="relative mx-auto max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search orders, items, or staff..." className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="rounded bg-emerald-600/20 px-2 py-1 text-[10px] font-bold text-emerald-400">● {user?.name ?? "Chef"}</span>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function Kitchen() {
  const orders = [
    { id: "#ORD-9601", emp: "Jane Diaz", station: "Hot Deli", item: "2x Wagyu Burger, 1x Truffle Fries", time: "04:32", status: "NEW", statusColor: "bg-destructive text-destructive-foreground", action: "Preparing" },
    { id: "#ORD-9598", emp: "Marcus Smets", station: "Salad Bar", item: "1x Quinoa Bowl (Side of Beets)", time: "05:48", status: "PREPARING", statusColor: "bg-primary text-primary-foreground", action: "Ready" },
    { id: "#ORD-9592", emp: "Linda Chen", station: "Beverages", item: "3x Iced Latte, 1x Espresso", time: "12:15", status: "COMPLETED", statusColor: "bg-emerald-600 text-white", action: "Print Receipt" },
    { id: "#ORD-9587", emp: "Tobi Andrej", station: "Hot Deli", item: "1x Ribeye Steak (Medium)", time: "07:30", status: "NEW", statusColor: "bg-destructive text-destructive-foreground", action: "Preparing" },
  ];

  const stations = [
    { name: "Hot Grill", load: "100%", color: "bg-destructive" },
    { name: "Salad Bar", load: "45m", color: "bg-warning" },
    { name: "Beverages", load: "38%", color: "bg-emerald-500" },
    { name: "Oven Station", load: "76m", color: "bg-primary", highlight: true },
  ];

  return (
    <KitchenLayout title="Live Orders · Hot prep window: 8m">
      <div className="grid gap-4 lg:grid-cols-[3fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <div className="font-semibold">Live Orders</div>
              <div className="text-xs text-muted-foreground">Monitoring – Active preparation flow</div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="rounded-md bg-destructive px-3 py-1 font-semibold text-destructive-foreground">4 URGENT</span>
              <span className="rounded-md bg-muted px-3 py-1 font-semibold">12 TOTAL</span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-[10px] tracking-wider text-muted-foreground">
                <th className="px-3 py-2">ORDER ID</th>
                <th className="px-3 py-2">EMPLOYEE</th>
                <th className="px-3 py-2">STATION</th>
                <th className="px-3 py-2">ITEMS</th>
                <th className="px-3 py-2">TOTAL TIME</th>
                <th className="px-3 py-2">STATUS</th>
                <th className="px-3 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-3 text-xs text-primary">{o.id}</td>
                  <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-amber-700" />{o.emp}</div></td>
                  <td className="px-3 py-3 text-muted-foreground">{o.station}</td>
                  <td className="px-3 py-3 text-xs">{o.item}</td>
                  <td className="px-3 py-3 font-mono text-xs">{o.time}</td>
                  <td className="px-3 py-3"><span className={`rounded px-2 py-0.5 text-[10px] font-bold ${o.statusColor}`}>{o.status}</span></td>
                  <td className="px-3 py-3"><button className="rounded-md bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">{o.action}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] tracking-widest text-muted-foreground">TOTAL PREP TIME</div>
            <div className="text-2xl font-bold text-primary">14:25 <span className="text-xs text-muted-foreground">MINS</span></div>
            <div className="mt-3 text-[10px] tracking-widest text-muted-foreground">CURRENT LOAD</div>
            <div className="mt-1 h-2 rounded-full bg-muted">
              <div className="h-2 w-[84%] rounded-full bg-primary" />
            </div>
            <div className="mt-1 text-xs font-bold">84%</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 text-sm font-semibold">Station Status</div>
            <div className="space-y-2">
              {stations.map((s) => (
                <div key={s.name} className={`flex items-center justify-between rounded-md border p-2 text-xs ${s.highlight ? "border-primary bg-primary/10" : "border-border"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.color}`} />
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">Active</div>
                    </div>
                  </div>
                  <span className="font-mono">{s.load}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <Plus className="h-5 w-5" />
      </button>
    </KitchenLayout>
  );
}
