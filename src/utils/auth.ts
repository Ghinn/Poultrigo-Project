export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "guest" | "operator" | "admin";
  createdAt: string;
  last_login?: string;
}

const CURRENT_USER_KEY = "poultrigo_current_user";

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function logout(): void {
  setCurrentUser(null);
}
