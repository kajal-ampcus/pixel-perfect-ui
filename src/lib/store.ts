// Centralized in-memory + localStorage data store for the canteen admin app.
// All CRUD goes through here so every screen stays in sync.

import { useEffect, useState } from "react";

export type ItemCategory = "Veg" | "Non-Veg" | "Beverages";
export type ItemType = "Breakfast" | "Meal";
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const ALL_DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number; // INR
  category: ItemCategory;
  type: ItemType;
  slot: string; // Breakfast / Lunch / Dinner / Snacks
  image?: string; // base64 or URL
  days: Day[];
  live: boolean;
  tag?: string;
};

export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered" | "Cancelled" | "Completed";

export type OrderLine = { itemId: string; name: string; qty: number; price: number };

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  department: string;
  slot: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO
};

export type Customer = {
  id: string;
  name: string;
  empId: string;
  department: string;
};

const STORAGE_KEY = "canteen.store.v1";

type StoreShape = {
  menu: MenuItem[];
  orders: Order[];
  customers: Customer[];
};

const uid = () => Math.random().toString(36).slice(2, 10);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const formatINR = inr;

function seedCustomers(): Customer[] {
  return [
    { id: "c1", name: "Arjun Sharma", empId: "EMP-2045", department: "Engineering" },
    { id: "c2", name: "Priya Kapoor", empId: "EMP-2099", department: "Marketing" },
    { id: "c3", name: "Rohan Verma", empId: "EMP-1102", department: "Sales" },
    { id: "c4", name: "Meera Lakshmi", empId: "EMP-2088", department: "Engineering" },
    { id: "c5", name: "Sandeep Iyer", empId: "EMP-3010", department: "Operations" },
    { id: "c6", name: "Neha Gupta", empId: "EMP-2210", department: "HR" },
  ];
}

function seedMenu(): MenuItem[] {
  const base: Omit<MenuItem, "id">[] = [
    { name: "Paneer Butter Masala", description: "Cottage cheese in rich tomato gravy.", price: 180, category: "Veg", type: "Meal", slot: "Lunch", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400", days: [...ALL_DAYS], live: true, tag: "POPULAR" },
    { name: "Grilled Chicken Wrap", description: "Spiced grilled chicken with veggies in a wrap.", price: 220, category: "Non-Veg", type: "Meal", slot: "Lunch", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], live: true, tag: "SPICY" },
    { name: "Masala Dosa", description: "Crispy rice crepe with potato filling.", price: 90, category: "Veg", type: "Breakfast", slot: "Breakfast", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400", days: [...ALL_DAYS], live: true, tag: "BREAKFAST" },
    { name: "Cold Brew Coffee", description: "Slow-steeped cold coffee.", price: 110, category: "Beverages", type: "Breakfast", slot: "Breakfast", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", days: [...ALL_DAYS], live: true, tag: "COLD" },
    { name: "Quinoa Salad Bowl", description: "Quinoa, chickpeas, avocado, tahini.", price: 240, category: "Veg", type: "Meal", slot: "Lunch", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400", days: ["Mon", "Wed", "Fri"], live: true, tag: "HEALTHY" },
    { name: "Veg Thali", description: "Roti, dal, sabzi, rice, curd.", price: 160, category: "Veg", type: "Meal", slot: "Lunch", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", days: [...ALL_DAYS], live: true, tag: "VALUE" },
    { name: "Fresh Lime Soda", description: "Chilled lime soda, sweet & salt.", price: 60, category: "Beverages", type: "Meal", slot: "Lunch", image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400", days: [...ALL_DAYS], live: true },
    { name: "Chicken Biryani", description: "Long-grain rice with chicken.", price: 260, category: "Non-Veg", type: "Meal", slot: "Dinner", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", days: ["Tue", "Thu", "Sat"], live: false, tag: "CHEF SPECIAL" },
  ];
  return base.map((b) => ({ id: uid(), ...b }));
}

function seedOrders(menu: MenuItem[], customers: Customer[]): Order[] {
  const today = new Date();
  const mk = (offsetDays: number, hour: number, idx: number, status: OrderStatus, items: { name: string; qty: number }[]) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    d.setHours(hour, 15, 0, 0);
    const cust = customers[idx % customers.length];
    const lines: OrderLine[] = items.map((i) => {
      const m = menu.find((x) => x.name === i.name) ?? menu[0];
      return { itemId: m.id, name: m.name, qty: i.qty, price: m.price };
    });
    return {
      id: uid(),
      orderNumber: `ORD-${8800 + idx + offsetDays * 7}`,
      customerId: cust.id,
      customerName: cust.name,
      department: cust.department,
      slot: hour < 11 ? "Breakfast" : hour < 16 ? "Lunch" : "Dinner",
      items: lines,
      total: lines.reduce((s, l) => s + l.qty * l.price, 0),
      status,
      createdAt: d.toISOString(),
    };
  };
  return [
    mk(0, 9, 0, "Preparing", [{ name: "Masala Dosa", qty: 1 }, { name: "Cold Brew Coffee", qty: 1 }]),
    mk(0, 13, 1, "Ready", [{ name: "Paneer Butter Masala", qty: 1 }, { name: "Veg Thali", qty: 1 }]),
    mk(0, 13, 2, "Delivered", [{ name: "Grilled Chicken Wrap", qty: 1 }, { name: "Fresh Lime Soda", qty: 1 }]),
    mk(0, 14, 3, "Pending", [{ name: "Quinoa Salad Bowl", qty: 1 }]),
    mk(1, 13, 0, "Completed", [{ name: "Veg Thali", qty: 2 }]),
    mk(1, 9, 4, "Completed", [{ name: "Masala Dosa", qty: 1 }, { name: "Cold Brew Coffee", qty: 2 }]),
    mk(2, 13, 1, "Completed", [{ name: "Paneer Butter Masala", qty: 1 }]),
    mk(3, 20, 5, "Completed", [{ name: "Chicken Biryani", qty: 1 }]),
    mk(5, 13, 2, "Completed", [{ name: "Grilled Chicken Wrap", qty: 1 }, { name: "Fresh Lime Soda", qty: 1 }]),
    mk(7, 9, 0, "Completed", [{ name: "Masala Dosa", qty: 1 }]),
    mk(10, 13, 3, "Completed", [{ name: "Quinoa Salad Bowl", qty: 1 }, { name: "Fresh Lime Soda", qty: 1 }]),
  ];
}

function load(): StoreShape {
  if (typeof window === "undefined") {
    const customers = seedCustomers();
    const menu = seedMenu();
    return { customers, menu, orders: seedOrders(menu, customers) };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoreShape;
  } catch {
    /* ignore */
  }
  const customers = seedCustomers();
  const menu = seedMenu();
  const data: StoreShape = { customers, menu, orders: seedOrders(menu, customers) };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* noop */ }
  return data;
}

let state: StoreShape = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useStore<T>(selector: (s: StoreShape) => T): T {
  const [snap, setSnap] = useState<T>(() => selector(state));
  useEffect(() => {
    const unsub = subscribe(() => setSnap(selector(state)));
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return snap;
}

// ----- Menu CRUD -----
export function listMenu(): MenuItem[] { return state.menu; }

export function createMenuItem(input: Omit<MenuItem, "id">): MenuItem {
  const item: MenuItem = { id: uid(), ...input };
  state = { ...state, menu: [item, ...state.menu] };
  persist(); emit();
  return item;
}

export function updateMenuItem(id: string, patch: Partial<MenuItem>): void {
  state = { ...state, menu: state.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) };
  persist(); emit();
}

export function deleteMenuItem(id: string): void {
  state = { ...state, menu: state.menu.filter((m) => m.id !== id) };
  persist(); emit();
}

// ----- Orders -----
export function listOrders(): Order[] { return state.orders; }

export function updateOrderStatus(id: string, status: OrderStatus): void {
  state = { ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) };
  persist(); emit();
}

export function createOrder(input: Omit<Order, "id" | "orderNumber" | "createdAt">): Order {
  const order: Order = {
    id: uid(),
    orderNumber: `ORD-${9000 + state.orders.length + 1}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  state = { ...state, orders: [order, ...state.orders] };
  persist(); emit();
  return order;
}

// ----- Customers -----
export function listCustomers(): Customer[] { return state.customers; }

// ----- CSV helpers -----
export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function resetStore() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  state = load();
  emit();
}
