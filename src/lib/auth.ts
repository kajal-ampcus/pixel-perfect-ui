// Mock auth system using localStorage. Replace with real backend later.

export type Role = "employee" | "kitchen" | "admin";

export interface MockUser {
  id: string;
  pin: string;
  role: Role;
  name: string;
  email: string;
  department?: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: "EMP-1234", pin: "1234", role: "employee", name: "Garth Wilson", email: "garth@company.com", department: "Engineering" },
  { id: "EMP-2045", pin: "2045", role: "employee", name: "Arjun Sharma", email: "arjun@company.com", department: "Engineering" },
  { id: "CHEF-001", pin: "0001", role: "kitchen", name: "Chef Sonia", email: "sonia@company.com", department: "Kitchen" },
  { id: "CHEF-002", pin: "0002", role: "kitchen", name: "Chef David", email: "david@company.com", department: "Kitchen" },
  { id: "ADM-001", pin: "9999", role: "admin", name: "Admin Portal", email: "admin@company.com", department: "Operations" },
  { id: "CAN-029", pin: "0029", role: "admin", name: "System Admin", email: "system@company.com", department: "Operations" },
];

const STORAGE_KEY = "canteenpro:auth";

export interface AuthSession {
  user: MockUser;
  loggedInAt: number;
}

export function login(role: Role, id: string, pin: string): MockUser {
  const user = MOCK_USERS.find(
    (u) => u.role === role && u.id.toLowerCase() === id.toLowerCase() && u.pin === pin,
  );
  if (!user) {
    throw new Error(
      `Invalid credentials. Try the demo: ${role === "employee" ? "EMP-1234 / 1234" : role === "kitchen" ? "CHEF-001 / 0001" : "ADM-001 / 9999"}`,
    );
  }
  const session: AuthSession = { user, loggedInAt: Date.now() };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return user;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): MockUser | null {
  return getSession()?.user ?? null;
}

export function resetPassword(id: string, newPin: string): MockUser {
  const user = MOCK_USERS.find((u) => u.id.toLowerCase() === id.toLowerCase());
  if (!user) throw new Error("No user found with that Employee ID");
  if (!/^\d{4}$/.test(newPin)) throw new Error("PIN must be 4 digits");
  user.pin = newPin;
  return user;
}

export function homeRouteFor(role: Role): "/dashboard" | "/kitchen" | "/admin" {
  return role === "kitchen" ? "/kitchen" : role === "admin" ? "/admin" : "/dashboard";
}
