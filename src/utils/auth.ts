export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "guest" | "operator" | "admin";
  createdAt: string;
}

const STORAGE_KEY = "poultrigo_users";
const CURRENT_USER_KEY = "poultrigo_current_user";

export function saveUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return newUser;
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

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

export function updateUser(userId: string, updates: Partial<Omit<User, "id" | "createdAt">>): User | null {
  if (typeof window === "undefined") return null;
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return users[userIndex];
}

export function deleteUser(userId: string): boolean {
  if (typeof window === "undefined") return false;
  const users = getUsers();
  const filteredUsers = users.filter((u) => u.id !== userId);
  
  if (filteredUsers.length === users.length) return false; // User not found
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredUsers));
  return true;
}

export function getUserById(userId: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.id === userId);
}

// Initialize demo users if none exist
export function initializeDemoUsers(): void {
  if (typeof window === "undefined") return;
  
  const users = getUsers();
  if (users.length > 0) return; // Already has users

  const demoUsers: Omit<User, "id" | "createdAt">[] = [
    {
      name: "Admin Developer",
      email: "admin@poultrigo.com",
      phone: "+62 812 3456 7890",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Operator Kandang",
      email: "operator@poultrigo.com",
      phone: "+62 812 3456 7891",
      password: "operator123",
      role: "operator",
    },
    {
      name: "Guest Pembeli",
      email: "guest@poultrigo.com",
      phone: "+62 812 3456 7892",
      password: "guest123",
      role: "guest",
    },
  ];

  demoUsers.forEach((user) => saveUser(user));
}

