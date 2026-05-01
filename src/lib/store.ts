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
  slot: string; // Snacks / Dinner / Late Night Snacks
  image?: string; // base64 or URL
  days: Day[];
  live: boolean;
  tag?: string;
};

export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Delivered"
  | "Cancelled"
  | "Completed";

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
  cancellationReason?: string;
  cancelledAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  empId: string;
  department: string;
};

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  slot: string;
  image?: string;
};

export type MealSlot = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: "expired" | "active" | "upcoming";
};

const STORAGE_KEY = "canteen.store.v2";

type StoreShape = {
  menu: MenuItem[];
  orders: Order[];
  customers: Customer[];
  cart: CartItem[];
  walletBalance: number;
};

const uid = () => Math.random().toString(36).slice(2, 10);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const formatINR = inr;

function normalizeCompanySlot(slot: string | undefined): string {
  switch (slot) {
    case "Breakfast":
    case "Snacks":
      return "Snacks";
    case "Lunch":
    case "Dinner":
      return "Dinner";
    case "Late Night Snacks":
      return "Late Night Snacks";
    default:
      return "Snacks";
  }
}

function lateNightTestItems(): Omit<MenuItem, "id">[] {
  return [
    {
      name: "Midnight Masala Maggi",
      description: "Hot masala noodles with sweet corn, onion, and green chilli.",
      price: 80,
      category: "Veg",
      type: "Meal",
      slot: "Late Night Snacks",
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "LATE NIGHT",
    },
    {
      name: "Cheese Chilli Toast",
      description: "Crisp toast loaded with cheese, peppers, and herbs.",
      price: 120,
      category: "Veg",
      type: "Meal",
      slot: "Late Night Snacks",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "NEW",
    },
    {
      name: "Night Shift Coffee",
      description: "Strong hot coffee brewed for the last stretch of the shift.",
      price: 70,
      category: "Beverages",
      type: "Breakfast",
      slot: "Late Night Snacks",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "HOT",
    },
  ];
}

function ensureLateNightItems(menu: MenuItem[]): MenuItem[] {
  const names = new Set(menu.map((item) => item.name));
  const missing = lateNightTestItems().filter((item) => !names.has(item.name));
  if (missing.length === 0) return menu;
  return [...menu, ...missing.map((item) => ({ id: uid(), ...item }))];
}

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
    {
      name: "Paneer Butter Masala",
      description: "Cottage cheese in rich tomato gravy with butter naan.",
      price: 180,
      category: "Veg",
      type: "Meal",
      slot: "Dinner",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "POPULAR",
    },
    {
      name: "Grilled Chicken Wrap",
      description: "Spiced grilled chicken with fresh veggies in a tortilla wrap.",
      price: 220,
      category: "Non-Veg",
      type: "Meal",
      slot: "Dinner",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      live: true,
      tag: "SPICY",
    },
    {
      name: "Masala Dosa",
      description: "Crispy rice crepe with spiced potato filling and chutneys.",
      price: 90,
      category: "Veg",
      type: "Breakfast",
      slot: "Snacks",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "SNACKS",
    },
    {
      name: "Cold Brew Coffee",
      description: "Slow-steeped cold coffee, smooth and refreshing.",
      price: 110,
      category: "Beverages",
      type: "Breakfast",
      slot: "Late Night Snacks",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "COLD",
    },
    {
      name: "Quinoa Salad Bowl",
      description: "Quinoa, chickpeas, avocado, cherry tomatoes with tahini.",
      price: 240,
      category: "Veg",
      type: "Meal",
      slot: "Snacks",
      image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400",
      days: ["Mon", "Wed", "Fri"],
      live: true,
      tag: "HEALTHY",
    },
    {
      name: "Veg Thali",
      description: "Complete meal with roti, dal, sabzi, rice, and curd.",
      price: 160,
      category: "Veg",
      type: "Meal",
      slot: "Dinner",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "VALUE",
    },
    {
      name: "Fresh Lime Soda",
      description: "Chilled lime soda with your choice of sweet or salt.",
      price: 60,
      category: "Beverages",
      type: "Meal",
      slot: "Snacks",
      image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400",
      days: [...ALL_DAYS],
      live: true,
    },
    {
      name: "Chicken Biryani",
      description: "Fragrant long-grain rice with tender chicken pieces.",
      price: 260,
      category: "Non-Veg",
      type: "Meal",
      slot: "Dinner",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
      days: ["Tue", "Thu", "Sat"],
      live: true,
      tag: "CHEF SPECIAL",
    },
    {
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken.",
      price: 230,
      category: "Non-Veg",
      type: "Meal",
      slot: "Dinner",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "BESTSELLER",
    },
    {
      name: "Idli Sambar",
      description: "Steamed rice cakes with lentil soup and chutneys.",
      price: 70,
      category: "Veg",
      type: "Breakfast",
      slot: "Snacks",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400",
      days: [...ALL_DAYS],
      live: true,
    },
    {
      name: "Fruit Smoothie Bowl",
      description: "Blended fruits topped with granola and fresh berries.",
      price: 150,
      category: "Beverages",
      type: "Breakfast",
      slot: "Late Night Snacks",
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
      days: [...ALL_DAYS],
      live: true,
      tag: "HEALTHY",
    },
    {
      name: "Pasta Arrabiata",
      description: "Penne pasta in spicy tomato sauce with herbs.",
      price: 190,
      category: "Veg",
      type: "Meal",
      slot: "Late Night Snacks",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      days: ["Mon", "Wed", "Fri"],
      live: true,
    },
    ...lateNightTestItems(),
  ];
  return base.map((b) => ({ id: uid(), ...b }));
}

function seedOrders(menu: MenuItem[], customers: Customer[]): Order[] {
  const today = new Date();
  const mk = (
    offsetDays: number,
    hour: number,
    idx: number,
    status: OrderStatus,
    items: { name: string; qty: number }[],
  ) => {
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
      slot: hour < 16 ? "Snacks" : hour < 21 ? "Dinner" : "Late Night Snacks",
      items: lines,
      total: lines.reduce((s, l) => s + l.qty * l.price, 0),
      status,
      createdAt: d.toISOString(),
    };
  };
  return [
    mk(0, 9, 0, "Preparing", [
      { name: "Masala Dosa", qty: 1 },
      { name: "Cold Brew Coffee", qty: 1 },
    ]),
    mk(0, 13, 1, "Ready", [
      { name: "Paneer Butter Masala", qty: 1 },
      { name: "Veg Thali", qty: 1 },
    ]),
    mk(0, 13, 2, "Delivered", [
      { name: "Grilled Chicken Wrap", qty: 1 },
      { name: "Fresh Lime Soda", qty: 1 },
    ]),
    mk(0, 14, 3, "Pending", [{ name: "Quinoa Salad Bowl", qty: 1 }]),
    mk(1, 13, 0, "Completed", [{ name: "Veg Thali", qty: 2 }]),
    mk(1, 9, 4, "Completed", [
      { name: "Masala Dosa", qty: 1 },
      { name: "Cold Brew Coffee", qty: 2 },
    ]),
    mk(2, 13, 1, "Completed", [{ name: "Paneer Butter Masala", qty: 1 }]),
    mk(3, 20, 5, "Completed", [{ name: "Chicken Biryani", qty: 1 }]),
    mk(5, 13, 2, "Completed", [
      { name: "Grilled Chicken Wrap", qty: 1 },
      { name: "Fresh Lime Soda", qty: 1 },
    ]),
    mk(7, 9, 0, "Completed", [{ name: "Masala Dosa", qty: 1 }]),
    mk(10, 13, 3, "Completed", [
      { name: "Quinoa Salad Bowl", qty: 1 },
      { name: "Fresh Lime Soda", qty: 1 },
    ]),
  ];
}

function load(): StoreShape {
  if (typeof window === "undefined") {
    const customers = seedCustomers();
    const menu = seedMenu();
    return { customers, menu, orders: seedOrders(menu, customers), cart: [], walletBalance: 2500 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreShape;
      // Ensure cart exists (migration)
      if (!parsed.cart) parsed.cart = [];
      if (!parsed.walletBalance) parsed.walletBalance = 2500;
      parsed.menu = parsed.menu.map((item) => ({
        ...item,
        slot: normalizeCompanySlot(item.slot),
      }));
      parsed.menu = ensureLateNightItems(parsed.menu);
      parsed.orders = parsed.orders.map((order) => ({
        ...order,
        status:
          (order.status as string) === "Accepted"
            ? "Preparing"
            : order.status === "Completed"
              ? "Delivered"
              : order.status,
      }));
      parsed.cart = parsed.cart
        .map((item) => ({
          ...item,
          slot: normalizeCompanySlot(
            item.slot ?? parsed.menu.find((m) => m.id === item.itemId)?.slot,
          ),
        }))
        .filter((item) => item.slot);
      return parsed;
    }
  } catch {
    /* ignore */
  }
  const customers = seedCustomers();
  const menu = seedMenu();
  const data: StoreShape = {
    customers,
    menu,
    orders: seedOrders(menu, customers),
    cart: [],
    walletBalance: 2500,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
  return data;
}

let state: StoreShape = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
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
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return snap;
}

// ----- Menu CRUD -----
export function listMenu(): MenuItem[] {
  return state.menu;
}

export function createMenuItem(input: Omit<MenuItem, "id">): MenuItem {
  const item: MenuItem = { id: uid(), ...input };
  state = { ...state, menu: [item, ...state.menu] };
  persist();
  emit();
  return item;
}

export function updateMenuItem(id: string, patch: Partial<MenuItem>): void {
  state = { ...state, menu: state.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) };
  persist();
  emit();
}

export function deleteMenuItem(id: string): void {
  state = { ...state, menu: state.menu.filter((m) => m.id !== id) };
  persist();
  emit();
}

// ----- Orders -----
export function listOrders(): Order[] {
  return state.orders;
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  state = { ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) };
  persist();
  emit();
}

export function cancelOrder(id: string, reason: string): void {
  state = {
    ...state,
    orders: state.orders.map((o) =>
      o.id === id
        ? {
            ...o,
            status: "Cancelled",
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
          }
        : o,
    ),
  };
  persist();
  emit();
}

export function createOrder(input: Omit<Order, "id" | "orderNumber" | "createdAt">): Order {
  const order: Order = {
    id: uid(),
    orderNumber: `ORD-${9000 + state.orders.length + 1}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  state = { ...state, orders: [order, ...state.orders] };
  persist();
  emit();
  return order;
}

export function createOrdersFromCart(
  customer: Omit<Customer, "empId"> & { empId?: string },
): Order[] {
  if (state.cart.length === 0) return [];
  const total = getCartTotal();
  if (!deductFromWallet(total)) return [];

  const grouped = state.cart.reduce(
    (acc, item) => {
      if (!acc[item.slot]) acc[item.slot] = [];
      acc[item.slot].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );

  const orders = Object.entries(grouped).map(([slot, items]) =>
    createOrder({
      customerId: customer.id,
      customerName: customer.name,
      department: customer.department,
      slot,
      items: items.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      status: "Pending",
    }),
  );

  clearCart();
  return orders;
}

export function createOrderFromCartSlot(
  slot: string,
  customer: Omit<Customer, "empId"> & { empId?: string },
): Order | undefined {
  const items = state.cart.filter((item) => item.slot === slot);
  if (items.length === 0) return undefined;

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (!deductFromWallet(total)) return undefined;

  const order = createOrder({
    customerId: customer.id,
    customerName: customer.name,
    department: customer.department,
    slot,
    items: items.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    total,
    status: "Pending",
  });

  state = { ...state, cart: state.cart.filter((item) => item.slot !== slot) };
  persist();
  emit();
  return order;
}

// ----- Customers -----
export function listCustomers(): Customer[] {
  return state.customers;
}

// ----- Cart -----
export function getCart(): CartItem[] {
  return state.cart;
}

export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }): void {
  const existing = state.cart.find((c) => c.itemId === item.itemId);
  if (existing) {
    state = {
      ...state,
      cart: state.cart.map((c) =>
        c.itemId === item.itemId ? { ...c, qty: c.qty + (item.qty ?? 1) } : c,
      ),
    };
  } else {
    state = { ...state, cart: [...state.cart, { ...item, qty: item.qty ?? 1 }] };
  }
  persist();
  emit();
}

export function updateCartItemQty(itemId: string, qty: number): void {
  if (qty <= 0) {
    removeFromCart(itemId);
    return;
  }
  state = {
    ...state,
    cart: state.cart.map((c) => (c.itemId === itemId ? { ...c, qty } : c)),
  };
  persist();
  emit();
}

export function removeFromCart(itemId: string): void {
  state = { ...state, cart: state.cart.filter((c) => c.itemId !== itemId) };
  persist();
  emit();
}

export function clearCartSlot(slot: string): void {
  state = { ...state, cart: state.cart.filter((item) => item.slot !== slot) };
  persist();
  emit();
}

export function clearCart(): void {
  state = { ...state, cart: [] };
  persist();
  emit();
}

export function getCartTotal(): number {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ----- Wallet -----
export function getWalletBalance(): number {
  return state.walletBalance;
}

export function deductFromWallet(amount: number): boolean {
  if (state.walletBalance < amount) return false;
  state = { ...state, walletBalance: state.walletBalance - amount };
  persist();
  emit();
  return true;
}

export function addToWallet(amount: number): void {
  state = { ...state, walletBalance: state.walletBalance + amount };
  persist();
  emit();
}

// ----- Helpers -----
export function getActiveOrder(): Order | undefined {
  return state.orders.find(
    (o) => o.status === "Pending" || o.status === "Preparing" || o.status === "Ready",
  );
}

export function getOrderStats() {
  const now = new Date();
  const thisMonth = state.orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const completed = thisMonth.filter((o) => o.status === "Completed" || o.status === "Delivered");
  const cancelled = thisMonth.filter((o) => o.status === "Cancelled");
  const spending = completed.reduce((sum, o) => sum + o.total, 0);

  return {
    totalOrders: thisMonth.length,
    completedOrders: completed.length,
    cancelledOrders: cancelled.length,
    monthlySpending: spending,
  };
}

export function getMealSlots(): MealSlot[] {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinute = hour * 60 + minute;
  const currentTime = currentMinute <= 90 ? currentMinute + 1440 : currentMinute;

  const slots = [
    {
      id: "snacks",
      name: "Snacks",
      startTime: "02:30 PM",
      endTime: "03:30 PM",
      startMin: 870,
      endMin: 930,
    },
    {
      id: "dinner",
      name: "Dinner",
      startTime: "07:30 PM",
      endTime: "08:30 PM",
      startMin: 1170,
      endMin: 1230,
    },
    {
      id: "late-night-snacks",
      name: "Late Night Snacks",
      startTime: "12:30 AM",
      endTime: "01:30 AM",
      startMin: 1470,
      endMin: 1530,
    },
  ];

  return slots.map((s) => ({
    id: s.id,
    name: s.name,
    startTime: s.startTime,
    endTime: s.endTime,
    status: currentTime > s.endMin ? "expired" : currentTime >= s.startMin ? "active" : "upcoming",
  }));
}

export function getAvailableMealSlots(): MealSlot[] {
  return getMealSlots().filter((slot) => slot.status !== "expired");
}

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
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetStore() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  state = load();
  emit();
}
