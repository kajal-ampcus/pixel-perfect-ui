import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { UtensilsCrossed, User, ChefHat, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { login, homeRouteFor, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({ component: Login });

const DEMO_HINTS: Record<Role, { id: string; pin: string; label: string }> = {
  employee: { id: "EMP-1234", pin: "1234", label: "Employee" },
  kitchen: { id: "CHEF-001", pin: "0001", label: "Kitchen Staff" },
  admin: { id: "ADM-001", pin: "9999", label: "Admin" },
};

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Role>("employee");
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (t: Role) => {
    setTab(t);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = login(tab, id.trim(), pin.trim());
      await new Promise((r) => setTimeout(r, 250));
      navigate({ to: homeRouteFor(user.role) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setId(DEMO_HINTS[tab].id);
    setPin(DEMO_HINTS[tab].pin);
    setError("");
  };

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
              { icon: User, label: "Employee", sub: "Self Ordering", role: "employee" as const },
              { icon: ChefHat, label: "Kitchen", sub: "Live Queue", role: "kitchen" as const },
              { icon: Shield, label: "Admin", sub: "Management", role: "admin" as const },
            ].map((c) => (
              <button
                type="button"
                onClick={() => handleTabChange(c.role)}
                key={c.label}
                className={`rounded-xl border p-4 text-center backdrop-blur transition ${
                  tab === c.role ? "border-primary/60 bg-primary/15" : "border-white/10 bg-white/5"
                }`}
              >
                <c.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="text-xs font-semibold text-white">{c.label}</div>
                <div className="text-[10px] text-white/50">{c.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30">© 2024 CanteenPro Inc. All rights reserved.</p>

        <div className="pointer-events-none absolute right-20 top-24 h-3 w-3 rounded-full bg-primary/70" />
        <div className="pointer-events-none absolute right-10 top-1/2 h-4 w-4 rounded-full bg-emerald-500/70" />
        <div className="pointer-events-none absolute bottom-20 right-32 h-3 w-3 rounded-full bg-orange-400/70" />
      </div>

      {/* Right form panel */}
      <div className="flex w-full max-w-md items-center justify-center bg-[#f3ece1] p-8 md:w-[420px]">
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-xs text-slate-500">Select your role to access the relevant area.</p>
          </div>

          <div className="flex rounded-full bg-slate-200 p-1 text-xs font-semibold">
            {(["employee", "kitchen", "admin"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTabChange(t)}
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
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {tab === "employee" ? "Employee ID" : tab === "kitchen" ? "Chef ID" : "Admin ID"}
              </label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={DEMO_HINTS[tab].id}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">PIN</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                placeholder="••••"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in to Dashboard"} <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={fillDemo}
            className="w-full rounded-md border border-slate-300 bg-white py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Use demo credentials ({DEMO_HINTS[tab].id} / {DEMO_HINTS[tab].pin})
          </button>

          <div className="space-y-1 text-center text-xs">
            <Link to="/forgot-password" className="block text-primary hover:underline">
              Need help accessing your account?
            </Link>
            <div className="text-emerald-600">● SYSTEM OPERATIONAL</div>
          </div>
        </form>
      </div>
    </div>
  );
}
