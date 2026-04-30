import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type BottomNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Optional bg gradient/color class for the icon tile */
  color?: string;
};

export function BottomNav({ items }: { items: BottomNavItem[] }) {
  const location = useLocation();
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setScrolling(false), 280);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <nav
      className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 px-2 transition-all duration-300"
      style={{ width: "min(100%, 60rem)" }}
      aria-label="Primary"
    >
      <ul
        className={[
          "flex items-center justify-around gap-1 rounded-2xl border border-white/10 px-2 py-2",
          "bg-card/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-card/60",
          "transition-all duration-300",
          scrolling ? "opacity-70 backdrop-blur-2xl" : "opacity-100",
        ].join(" ")}
      >
        {items.map(({ to, label, icon: Icon, color }) => {
          const active = location.pathname === to;
          return (
            <li key={to} className="group relative flex-1">
              {/* Tooltip */}
              <span
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
                role="tooltip"
              >
                {label}
              </span>
              <Link
                to={to}
                className="flex flex-col items-center gap-1 rounded-xl px-1 py-1 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300",
                    active
                      ? `${color ?? "bg-primary"} text-white shadow-[0_8px_24px_-6px] shadow-primary/60 scale-110 ring-2 ring-white/20`
                      : "bg-gradient-to-br from-muted/80 to-muted text-muted-foreground shadow-inner group-hover:from-muted group-hover:to-card group-hover:text-foreground group-hover:shadow-[0_0_16px] group-hover:shadow-primary/30",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={[
                    "text-[10px] font-medium leading-none truncate max-w-[5rem]",
                    active ? "text-foreground" : "text-muted-foreground",
                  ].join(" ")}
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
