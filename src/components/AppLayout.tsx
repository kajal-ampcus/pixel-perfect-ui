import { useNavigate } from "@tanstack/react-router";
import {
  LayoutGrid,
  ShoppingBag,
  Clock3,
  ReceiptText,
  Flame,
  UtensilsCrossed,
  Bell,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";
import { logout, getCurrentUser } from "@/lib/auth";
import { BottomNav, type BottomNavItem } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav: BottomNavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, color: "bg-gradient-to-br from-violet-400 to-indigo-600" },
  { to: "/menu", label: "Menu", icon: ShoppingBag, color: "bg-gradient-to-br from-sky-400 to-blue-700" },
  { to: "/orders", label: "Orders", icon: Clock3, color: "bg-gradient-to-br from-cyan-300 to-sky-700" },
  { to: "/wallet", label: "Wallet", icon: ReceiptText, color: "bg-gradient-to-br from-amber-300 to-orange-600" },
  { to: "/notifications", label: "Alerts", icon: Flame, color: "bg-gradient-to-br from-rose-400 to-red-700" },
];

export function AppLayout({
  children,
  title,
  brand = "Canteen Portal",
  user,
}: {
  children: ReactNode;
  title?: string;
  brand?: string;
  brandSub?: string;
  user?: { name: string; role: string };
  showQuickOrder?: boolean;
}) {
  const navigate = useNavigate();
  const session = typeof window !== "undefined" ? getCurrentUser() : null;
  const displayUser = user ?? {
    name: session?.name ?? "Guest",
    role: (session?.department ?? "EMPLOYEE").toUpperCase(),
  };
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-primary leading-tight">{brand}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">
              {title ?? "EMPLOYEE"}
            </div>
          </div>
        </div>
        <div className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search orders, items..."
            className="w-full rounded-md bg-input/60 py-1.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="ml-auto text-muted-foreground hover:text-foreground md:ml-0">
          <Bell className="h-4 w-4" />
        </button>
        <button className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <div className="text-xs font-semibold leading-none">{displayUser.name}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground">
              {displayUser.role}
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-700" />
        </div>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 pb-28 md:p-6 md:pb-28">
        {children}
      </main>

      <BottomNav items={nav} />
    </div>
  );
}
