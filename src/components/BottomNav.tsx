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
  const [hovered, setHovered] = useState<number | null>(null);
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
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-3 transition-all duration-300"
      style={{ width: "min(100%, 52rem)" }}
      aria-label="Primary"
    >
      <ul
        className={[
          "flex items-end justify-center gap-3 overflow-x-auto px-2 py-4",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "transition-all duration-300",
          scrolling ? "scale-[0.98]" : "scale-100",
        ].join(" ")}
      >
        {items.map(({ to, label, icon: Icon, color }) => {
          const index = items.findIndex((item) => item.to === to);
          const active = location.pathname === to;
          const distance = hovered === null ? null : Math.abs(hovered - index);
          const waveLift = distance === 0 ? "-translate-y-3" : distance === 1 ? "-translate-y-1.5" : "";
          const tileState = scrolling
            ? "scale-95 opacity-55 blur-[2px]"
            : active
              ? "scale-110 opacity-100 blur-0"
              : "scale-95 opacity-45 blur-[1.5px] hover:scale-105 hover:opacity-100 hover:blur-0";

          return (
            <li
              key={to}
              className="group relative shrink-0 pb-3"
              onMouseEnter={() => setHovered(index)}
              onMouseMove={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
                role="tooltip"
              >
                {label}
              </span>
              <Link
                to={to}
                aria-label={label}
                className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span
                  className={[
                    "relative flex h-12 w-12 items-center justify-center rounded-2xl text-white",
                    "border border-white/30 shadow-[0_18px_34px_-16px_rgba(0,0,0,0.7)]",
                    "transition-all duration-500 ease-out will-change-transform",
                    active
                      ? "ring-4 ring-white/70 shadow-[0_22px_42px_-14px_rgba(0,0,0,0.8)]"
                      : "ring-0",
                    color ?? "bg-gradient-to-br from-primary to-amber-600",
                    tileState,
                    !scrolling && waveLift,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 stroke-[2.4]" />
                </span>
                <span
                  className={[
                    "mt-2 block w-16 truncate text-center text-[10px] font-semibold leading-none transition-all duration-300",
                    scrolling
                      ? "opacity-40 blur-[1px]"
                      : active
                        ? "text-foreground opacity-100"
                        : "text-muted-foreground opacity-75 group-hover:text-foreground group-hover:opacity-100",
                  ].join(" ")}
                >
                  {label}
                </span>
                {active && !scrolling && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
