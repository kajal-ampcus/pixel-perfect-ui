import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Wallet,
  Bell,
  LogOut,
  Search,
  Settings,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { logout, getCurrentUser } from "@/lib/auth";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/orders", label: "My Orders", icon: ClipboardList },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function AppLayout({
  children,
  title,
  brand = "Canteen Portal",
  brandSub = "Employee Access",
  user,
  showQuickOrder = false,
}: {
  children: ReactNode;
  title?: string;
  brand?: string;
  brandSub?: string;
  user?: { name: string; role: string };
  showQuickOrder?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const session = typeof window !== "undefined" ? getCurrentUser() : null;
  const displayUser = user ?? {
    name: session?.name ?? "Guest",
    role: (session?.department ?? "EMPLOYEE").toUpperCase(),
  };
  const handleLogout = () => { logout(); navigate({ to: "/login" }); };
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar p-4 md:flex">
        <div className="mb-8 rounded-lg bg-primary/15 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-primary">{brand}</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">
                {brandSub}
              </div>
            </div>
          </div>
        </div>

        {showQuickOrder && (
          <button className="mb-4 flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Place Quick Order
          </button>
        )}

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-active text-primary border-r-2 border-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-active/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:text-primary"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card/40 px-6">
          <div className="text-sm font-semibold tracking-wider">
            {title ?? "CANTEENOPS"}
          </div>
          <div className="relative mx-auto hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search orders, items..."
              className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm text-foreground outline-none ring-0 focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-semibold">{displayUser.name}</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">
                {displayUser.role}
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
