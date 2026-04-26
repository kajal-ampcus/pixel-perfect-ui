import { createFileRoute, Link } from "@tanstack/react-router";
import { UtensilsCrossed, User, ChefHat, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [tab, setTab] = useState<"employee" | "kitchen" | "admin">("employee");
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left brand panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0e1730] via-[#13203f] to-[#0a1226] p-12 md:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white">CanteenPro</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight text-white">
            Your Canteen,
            <br />
            <span className="text-primary">Digitised.</span>
          </h1>
          <p className="max-w-md text-sm text-white/60">
            The all-in-one high-performance and adjustable kitchen + corporate dining solution for catering establishments.
          </p>

          <div className="grid max-w-md grid-cols-3 gap-3">
            {[
              { icon: User, label: "Employee", sub: "Self Ordering" },
              { icon: ChefHat, label: "Kitchen", sub: "Live Queue" },
              { icon: Shield, label: "Admin", sub: "Management" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur"
              >
                <c.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="text-xs font-semibold text-white">{c.label}</div>
                <div className="text-[10px] text-white/50">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30">© 2024 CanteenPro Inc. All rights reserved.</p>

        {/* decorative dots */}
        <div className="pointer-events-none absolute right-20 top-24 h-3 w-3 rounded-full bg-primary/70" />
        <div className="pointer-events-none absolute right-10 top-1/2 h-4 w-4 rounded-full bg-emerald-500/70" />
        <div className="pointer-events-none absolute bottom-20 right-32 h-3 w-3 rounded-full bg-orange-400/70" />
      </div>

      {/* Right form panel */}
      <div className="flex w-full max-w-md items-center justify-center bg-[#f3ece1] p-8 md:w-[420px]">
        <div className="w-full space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-xs text-slate-500">Select your role to access the relevant area.</p>
          </div>

          <div className="flex rounded-full bg-slate-200 p-1 text-xs font-semibold">
            {(["employee", "kitchen", "admin"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 capitalize transition ${
                  tab === t ? "bg-primary text-primary-foreground shadow" : "text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Employee ID</label>
              <input
                placeholder="e.g. CAN-029 or EMP-1234"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">PIN</label>
              <input
                type="password"
                placeholder="••••"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary"
              />
            </div>
          </div>

          <Link
            to={tab === "kitchen" ? "/kitchen" : tab === "admin" ? "/admin" : "/dashboard"}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
          >
            Sign in to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="space-y-1 text-center text-xs">
            <a className="block text-primary hover:underline" href="#">
              Need help accessing your account?
            </a>
            <div className="text-emerald-600">● SYSTEM OPERATIONAL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
