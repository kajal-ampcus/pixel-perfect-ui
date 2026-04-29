import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export type BottomNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Optional bg color class for the icon tile (mobile-app style) */
  color?: string;
};

export function BottomNav({ items }: { items: BottomNavItem[] }) {
  const location = useLocation();
  return (
    <nav
      className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 px-2"
      style={{ width: "min(100%, 56rem)" }}
      aria-label="Primary"
    >
      <ul className="flex items-center justify-around gap-1 rounded-2xl border border-border bg-card/95 px-2 py-2 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/80">
        {items.map(({ to, label, icon: Icon, color }) => {
          const active = location.pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="group flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    active
                      ? `${color ?? "bg-primary"} text-white shadow-lg scale-105`
                      : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`text-[10px] font-medium leading-none truncate max-w-[4.5rem] ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
