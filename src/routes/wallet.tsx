import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { TrendingUp, Download, Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

function WalletPage() {
  const items = [
    { date: "Oct 24, 2023", item: "Grilled Salmon Salad", img: "🥗", cat: "MAIN COURSE", catColor: "bg-emerald-600", amt: "$24.50" },
    { date: "Oct 23, 2023", item: "Cold Brew Coffee", img: "☕", cat: "BEVERAGE", catColor: "bg-blue-600", amt: "$4.75" },
    { date: "Oct 22, 2023", item: "Blueberry Muffin", img: "🧁", cat: "DESSERT", catColor: "bg-pink-500", amt: "$3.50" },
    { date: "Oct 22, 2023", item: "Angus Ribeye Steak", img: "🥩", cat: "MAIN COURSE", catColor: "bg-emerald-600", amt: "$32.00" },
  ];
  return (
    <AppLayout title="CanteenPro" brand="CanteenPro" brandSub="EMPLOYEE ID: 4829" user={{ name: "Alex Rivers", role: "EMPLOYEE" }}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-primary">FINANCIAL INSIGHTS</div>
          <h1 className="text-xl font-bold">Monthly Spending</h1>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
          <Download className="h-3.5 w-3.5" /> Download Report
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Spent (Oct 2023)</div>
              <div className="mt-1 text-2xl font-bold">$1,248.50</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-6 text-xs text-success">↑ 12% more than last month</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">Spending Trends</div>
            <div className="text-xs text-muted-foreground">May - Oct 2023</div>
          </div>
          {/* Tiny chart bars */}
          <div className="flex h-20 items-end gap-3">
            {[40, 55, 35, 70, 50, 90].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className={`w-full rounded-t ${i === 5 ? "bg-primary" : "bg-muted"}`} style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-6 text-center text-[10px] text-muted-foreground">
            {["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"].map((m, i) => (
              <span key={m} className={i === 5 ? "font-bold text-primary" : ""}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-semibold">Itemized Deductions</div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search items..." className="rounded-full bg-muted py-1 pl-7 pr-3 text-xs outline-none" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Item/Service</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.item} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-xs text-muted-foreground">{i.date}</td>
                <td className="px-4 py-3"><span className="mr-2">{i.img}</span>{i.item}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${i.catColor}`}>{i.cat}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{i.amt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border p-3 text-center">
          <a href="#" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            View All Transactions <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex rounded-full bg-muted p-1 text-xs">
          <button className="rounded-full bg-info px-4 py-1.5 text-white">Employee View</button>
          <button className="px-4 py-1.5 text-muted-foreground">Admin Oversight</button>
        </div>
      </div>
    </AppLayout>
  );
}
