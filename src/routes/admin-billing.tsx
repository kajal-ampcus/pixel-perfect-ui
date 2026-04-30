import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, Clock, CheckCircle2, X, Download, Filter, MoreVertical, Sparkles, Flag } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-billing")({ component: AdminBilling });

const rows = [
  { name: "Arjun Sharma", id: "#EMP-2045", dept: "Engineering", meals: 42, total: "₹4,200", status: "PROCESSED", color: "bg-success/20 text-success" },
  { name: "Priya Kapoor", id: "#EMP-2099", dept: "Marketing", meals: 28, total: "₹2,800", status: "PENDING", color: "bg-warning/20 text-warning" },
  { name: "Rohan Verma", id: "#EMP-1102", dept: "Sales", meals: 15, total: "₹1,500", status: "FLAGGED", color: "bg-destructive/20 text-destructive" },
  { name: "Meera L.", id: "#EMP-2088", dept: "Engineering", meals: 36, total: "₹3,600", status: "PROCESSED", color: "bg-success/20 text-success" },
];

const txns = [
  { date: "Oct 24, 2023", type: "Lunch", item: "Standard Thali", amt: "₹150" },
  { date: "Oct 23, 2023", type: "Breakfast", item: "Masala Dosa", amt: "₹80" },
  { date: "Oct 21, 2023", type: "Lunch", item: "Executive Lunch", amt: "₹220" },
  { date: "Oct 20, 2023", type: "Snacks", item: "Coffee & Cookies", amt: "₹65" },
];

function AdminBilling() {
  const [showTxn, setShowTxn] = useState<string | null>(null);

  return (
    <AdminLayout crumb="Monthly Billing">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Monthly Billing</h1>
        <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Download className="h-3 w-3" /> Export All</button>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Stat label="Total Deductions" value="₹1.2L" sub="↗ +12% from last month" icon={Wallet} color="text-primary" />
        <Stat label="Pending Reconciliation" value="₹15k" sub="● 24 items require attention" icon={Clock} color="text-warning" />
        <Stat label="Reconciliation Rate" value="92%" icon={CheckCircle2} color="text-success" progress={92} />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-semibold">Salary Deduction Table</div>
          <div className="flex gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><MoreVertical className="h-4 w-4 text-muted-foreground" /></div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-[10px] tracking-widest text-muted-foreground">
            <th className="px-4 py-2">EMPLOYEE NAME</th><th className="px-4 py-2">ID</th><th className="px-4 py-2">DEPT</th>
            <th className="px-4 py-2">MEALS</th><th className="px-4 py-2">TOTAL BILL</th><th className="px-4 py-2">STATUS</th><th className="px-4 py-2">ACTIONS</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{r.name.split(" ").map(n => n[0]).join("")}</div>{r.name}</div></td>
                <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-3 text-xs">{r.dept}</td>
                <td className="px-4 py-3 text-xs">{r.meals}</td>
                <td className="px-4 py-3 font-semibold">{r.total}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.color}`}>{r.status}</span></td>
                <td className="px-4 py-3"><button onClick={() => setShowTxn(r.name)} className="text-xs text-primary">View History</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-4 text-xs text-muted-foreground">
          Showing 1-4 of 1,240 employees<div className="flex gap-1"><button className="h-6 w-6 rounded border border-border">‹</button><button className="h-6 w-6 rounded border border-border">›</button></div>
        </div>
      </div>
        </div>
      </div>

      {showTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-5">
            <button onClick={() => setShowTxn(null)} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
            <div className="mb-4">
              <div className="text-lg font-bold">Employee Transaction History</div>
              <div className="text-xs text-primary">{showTxn} (#EMP-2045)</div>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-[10px] tracking-widest text-muted-foreground">
                <th className="py-2">DATE</th><th className="py-2">MEAL TYPE</th><th className="py-2">ITEM</th><th className="py-2 text-right">AMOUNT</th>
              </tr></thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.date} className="border-b border-border/40">
                    <td className="py-2 text-xs">{t.date}</td><td className="py-2 text-xs">{t.type}</td><td className="py-2 text-xs">{t.item}</td><td className="py-2 text-right font-semibold text-primary">{t.amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex items-center justify-between text-xs"><span className="text-muted-foreground">Cycle Total (22 Meals)</span><span className="text-lg font-bold">₹3,450</span></div>
            <button className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground">⬇ Download Individual Report</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Stat({ label, value, sub, icon: Icon, color, progress }: { label: string; value: string; sub?: string; icon: typeof Wallet; color: string; progress?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
          {sub && <div className="mt-1 text-[10px] text-muted-foreground">{sub}</div>}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-md bg-muted ${color}`}><Icon className="h-4 w-4" /></div>
      </div>
      {progress !== undefined && <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-success" style={{ width: `${progress}%` }} /></div>}
    </div>
  );
}
