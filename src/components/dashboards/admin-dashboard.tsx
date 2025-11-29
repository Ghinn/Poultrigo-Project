"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Users,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  Server,
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Bell,
  Menu,
  Newspaper,
  ShoppingCart,
  CheckCircle,
  Truck
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "@/actions/users";
import { getAllOrders, updateOrderStatus } from "@/actions/admin";
import { logout } from "@/actions/auth";
import { NewsManagement } from "./news-management";
import { setCurrentUser, type User } from "@/utils/auth";
import { useToast } from "@/components/ui/toast-provider";

type ModalMode = "create" | "edit" | "view" | null;

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "orders" | "news" | "sensors" | "system" | "logs"
  >("overview");

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "operator" | "guest">("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "guest" as "guest" | "operator" | "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showToast } = useToast();

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => { },
    isLoading: false,
  });

  // Order management state
  interface Order {
    id: string;
    orderNumber: string;
    date: string;
    customer: { name: string; email: string; whatsapp: string; address: string };
    products: string;
    total: number;
    status: string;
  }
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Load data functions
  const loadUsers = async () => {
    const allUsers = await getUsers();
    // Map users to include password (required by User type) - we'll use empty string since we don't expose passwords
    const mappedUsers: User[] = allUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: '', // Password is not exposed from getUsers for security
      role: u.role as "guest" | "operator" | "admin",
      createdAt: u.createdAt || u.created_at?.toISOString() || new Date().toISOString(),
      last_login: u.last_login
    }));
    setUsers(mappedUsers);
  };

  const loadOrders = async () => {
    const allOrders = await getAllOrders();
    setOrders(allOrders);
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      await loadUsers();
      await loadOrders();
    };
    void loadData();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filter orders
  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Update Status",
      message: `Apakah Anda yakin ingin mengubah status pesanan menjadi ${status}?`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        const res = await updateOrderStatus(orderId, status);
        if (res?.success) {
          showToast("Status pesanan berhasil diperbarui", "success");
          loadOrders();
        } else {
          showToast("Gagal memperbarui status pesanan", "error");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
      },
    });
  };

  const [oneDayAgo] = useState(() => Date.now() - 86400000);

  const stats = useMemo(() => [
    {
      label: "Total Pengguna",
      value: users.length.toString(),
      change: `+${users.filter((u) => new Date(u.createdAt).getTime() > oneDayAgo).length}`,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
    },
    {
      label: "Total Pesanan",
      value: orders.length.toString(),
      change: `+${orders.length > 0 ? orders.length : 0}`, // Simplified: show total orders
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
    {
      label: "Ketersediaan Sistem",
      value: "99.8%",
      change: "+0.2%",
      icon: Server,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      label: "Permintaan API",
      value: "45.2K",
      change: "+8.5K",
      icon: Database,
      color: "text-purple-500",
      bgColor: "bg-purple-500",
    },
  ], [users, orders, oneDayAgo]);

  // CRUD Functions
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "guest",
    });
    setSelectedUser(null);
    setModalMode("create");
    setError("");
  };

  const handleOpenEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setSelectedUser(user);
    setModalMode("edit");
    setError("");
  };

  const handleOpenView = (user: User) => {
    setSelectedUser(user);
    setModalMode("view");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "guest",
    });
    setError("");
  };

  const handleSave = async () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Nama lengkap wajib diisi");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email wajib diisi");
      return;
    }
    if (modalMode === "create" && !formData.password.trim()) {
      setError("Kata sandi wajib diisi");
      return;
    }
    if (modalMode === "create" && formData.password.length < 8) {
      setError("Kata sandi minimal 8 karakter");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (formData.password) data.append("password", formData.password);

    let result;
    if (modalMode === "create") {
      result = await createUser(null, data);
    } else if (modalMode === "edit" && selectedUser) {
      data.append("id", selectedUser.id);
      result = await updateUser(null, data);
    }

    if (result?.error) {
      setError(result.error);
      return;
    }

    loadUsers();
    handleCloseModal();
    showToast(modalMode === "create" ? "Pengguna berhasil dibuat" : "Pengguna berhasil diperbarui", "success");
  };

  const handleDelete = (userId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Pengguna",
      message: "Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        const res = await deleteUser(userId);
        if (res?.success) {
          showToast("Pengguna berhasil dihapus", "success");
          loadUsers();
          if (selectedUser?.id === userId) {
            handleCloseModal();
          }
        } else {
          showToast(res?.error || "Gagal menghapus pengguna", "error");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
      },
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Belum pernah login";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin Developer";
      case "operator":
        return "Operator Kandang";
      case "guest":
        return "Guest / Pembeli";
      default:
        return role;
    }
  };

  const sensors = [
    {
      id: "S001",
      type: "Temperature",
      location: "Kandang A1",
      status: "Online",
      lastUpdate: "1 sec ago",
      value: "28°C",
    },
    {
      id: "S002",
      type: "Humidity",
      location: "Kandang A1",
      status: "Online",
      lastUpdate: "1 sec ago",
      value: "65%",
    },
    {
      id: "S003",
      type: "Amonia",
      location: "Kandang A2",
      status: "Warning",
      lastUpdate: "5 menit lalu",
      value: "Tinggi",
    },
    {
      id: "S004",
      type: "Jarak Pakan",
      location: "Kandang B1",
      status: "Offline",
      lastUpdate: "1 jam lalu",
      value: "N/A",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-gradient-to-b from-orange-500 to-orange-600 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-b border-orange-400/30 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo/Logo Poultrigo_Logomark.svg"
                  alt="Poultrigo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <div>
                  <div className="font-semibold text-white">Poultrigo</div>
                  <div className="text-xs text-orange-100">Admin Developer</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-white transition-colors hover:bg-white/20 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
            {[
              { id: "overview", label: "Beranda", icon: Activity },
              { id: "users", label: "Kelola Pengguna", icon: Users },
              { id: "orders", label: "Kelola Pesanan", icon: ShoppingCart },
              { id: "news", label: "Kelola Berita", icon: Newspaper },
              { id: "sensors", label: "Konfigurasi Sensor", icon: Wifi },
              { id: "system", label: "Pengaturan Sistem", icon: Settings },
              { id: "logs", label: "Log Sistem", icon: Terminal },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors sm:px-4 sm:py-3 ${activeTab === tab.id
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-orange-50 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-orange-400/30 p-4">
            <button
              type="button"
              onClick={async () => {
                setCurrentUser(null);
                await logout();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-orange-50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-[#001B34] sm:text-xl">
                  {activeTab === "overview" && "Beranda"}
                  {activeTab === "users" && "Kelola Pengguna"}
                  {activeTab === "orders" && "Kelola Pesanan"}
                  {activeTab === "news" && "Kelola Berita"}
                  {activeTab === "sensors" && "Konfigurasi Sensor"}
                  {activeTab === "system" && "Pengaturan Sistem"}
                  {activeTab === "logs" && "Log Sistem"}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                  {activeTab === "overview" && "Ringkasan sistem dan aktivitas"}
                  {activeTab === "users" && "Atur dan pantau seluruh akun pengguna sistem"}
                  {activeTab === "orders" && "Kelola dan pantau pesanan pelanggan"}
                  {activeTab === "news" && "Kelola artikel berita dan publikasi"}
                  {activeTab === "sensors" && "Kelola dan konfigurasi sensor IoT"}
                  {activeTab === "system" && "Konfigurasi dan pengaturan sistem Poultrigo"}
                  {activeTab === "logs" && "Pemantauan aktivitas sistem secara real-time"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                title="Notifikasi"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className={`text-sm ${stat.color}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="mb-1 text-3xl text-[#001B34]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg text-[#001B34]">Kesehatan Sistem</h3>
                    <RefreshCw className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-[#001B34]" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Penggunaan CPU", value: 45, icon: Cpu, color: "bg-blue-500" },
                      {
                        label: "Pemakaian Memori",
                        value: 62,
                        icon: HardDrive,
                        color: "bg-green-500",
                      },
                      {
                        label: "Beban Basis Data",
                        value: 38,
                        icon: Database,
                        color: "bg-purple-500",
                      },
                      {
                        label: "Lalu Lintas Jaringan",
                        value: 71,
                        icon: Wifi,
                        color: "bg-orange-500",
                      },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <metric.icon className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {metric.label}
                            </span>
                          </div>
                          <span className="text-sm text-[#001B34]">
                            {metric.value}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div
                            className={`${metric.color} h-2 rounded-full`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-6 text-lg text-[#001B34]">Peringatan Terbaru</h3>
                  <div className="space-y-3">
                    {[
                      {
                        type: "warning",
                        message: "Amonia di Kandang A2 melebihi ambang batas",
                        time: "5 menit lalu",
                      },
                      {
                        type: "error",
                        message: "Sensor S004 terputus dari jaringan",
                        time: "1 jam lalu",
                      },
                      {
                        type: "info",
                        message: "Pencadangan sistem selesai",
                        time: "2 jam lalu",
                      },
                    ].map((alert) => (
                      <div
                        key={alert.message}
                        className={`rounded-lg border-l-4 p-4 ${alert.type === "error"
                          ? "border-red-500 bg-red-50"
                          : alert.type === "warning"
                            ? "border-orange-500 bg-orange-50"
                            : "border-blue-500 bg-blue-50"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`mt-0.5 h-5 w-5 ${alert.type === "error"
                              ? "text-red-500"
                              : alert.type === "warning"
                                ? "text-orange-500"
                                : "text-blue-500"
                              }`}
                          />
                          <div>
                            <p className="text-sm text-slate-700">
                              {alert.message}
                            </p>
                            <p className="text-xs text-slate-500">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Tambah Pengguna
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari pengguna..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-base text-slate-900 focus:border-[#001B34] focus:outline-none"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                    className="ml-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-[#001B34] focus:outline-none"
                  >
                    <option value="all">Semua Peran</option>
                    <option value="admin">Admin Developer</option>
                    <option value="operator">Operator Kandang</option>
                    <option value="guest">Guest / Pembeli</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        {[
                          "Nama",
                          "Email",
                          "Peran",
                          "Terakhir Login",
                          "Aksi",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-sm text-slate-600"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                            Tidak ada pengguna yang ditemukan
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm text-[#001B34]">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs ${user.role === "admin"
                                  ? "bg-[#001B34] text-white"
                                  : user.role === "operator"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-slate-100 text-slate-700"
                                  }`}
                              >
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {formatDate(user.last_login || "")}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenView(user)}
                                  className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                                  title="Lihat Detail"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(user)}
                                  className="rounded p-1.5 text-orange-600 hover:bg-orange-50"
                                  title="Edit Pengguna"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(user.id)}
                                  className="rounded p-1.5 text-red-600 hover:bg-red-50"
                                  title="Hapus Pengguna"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari pesanan..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-base text-slate-900 focus:border-[#001B34] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        {[
                          "ID Pesanan",
                          "Pelanggan",
                          "Produk",
                          "Total",
                          "Tanggal",
                          "Status",
                          "Aksi",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-sm text-slate-600"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                            Tidak ada pesanan yang ditemukan
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-medium text-[#001B34]">
                              {order.orderNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="font-medium text-[#001B34]">{order.customer.name}</div>
                              <div className="text-xs">{order.customer.whatsapp}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {order.products}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-[#001B34]">
                              Rp {order.total.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {order.date}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs ${order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "shipped"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                              >
                                {order.status === "pending" && "Menunggu"}
                                {order.status === "processing" && "Diproses"}
                                {order.status === "shipped" && "Diantar"}
                                {order.status === "completed" && "Selesai"}
                                {order.status === "cancelled" && "Dibatalkan"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                  className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                                  title="Proses Pesanan"
                                  disabled={order.status !== 'pending'}
                                >
                                  <RefreshCw className={`h-4 w-4 ${order.status !== 'pending' ? 'opacity-30' : ''}`} />
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                  className="rounded p-1.5 text-purple-600 hover:bg-purple-50"
                                  title="Antar Pesanan"
                                  disabled={order.status !== 'processing'}
                                >
                                  <Truck className={`h-4 w-4 ${order.status !== 'processing' ? 'opacity-30' : ''}`} />
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                  className="rounded p-1.5 text-green-600 hover:bg-green-50"
                                  title="Selesaikan Pesanan"
                                  disabled={order.status === 'completed'}
                                >
                                  <CheckCircle className={`h-4 w-4 ${order.status === 'completed' ? 'opacity-30' : ''}`} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "news" && <NewsManagement />}

          {activeTab === "sensors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Tambah Sensor
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${sensor.status === "Online"
                          ? "bg-green-100"
                          : sensor.status === "Warning"
                            ? "bg-orange-100"
                            : "bg-red-100"
                          }`}
                      >
                        <Activity
                          className={`h-5 w-5 ${sensor.status === "Online"
                            ? "text-green-600"
                            : sensor.status === "Warning"
                              ? "text-orange-600"
                              : "text-red-600"
                            }`}
                        />
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${sensor.status === "Online"
                          ? "bg-green-100 text-green-700"
                          : sensor.status === "Warning"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {sensor.status}
                      </span>
                    </div>
                    <div className="mb-1 text-sm text-slate-500">{sensor.id}</div>
                    <div className="mb-1 text-[#001B34]">{sensor.type}</div>
                    <div className="mb-3 text-sm text-slate-600">
                      {sensor.location}
                    </div>
                    <div className="mb-2 text-2xl text-[#001B34]">
                      {sensor.value}
                    </div>
                    <div className="text-xs text-slate-500">
                      Diperbarui {sensor.lastUpdate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Pengaturan Umum */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#001B34]">
                        Pengaturan Umum
                      </h3>
                      <p className="text-sm text-slate-500">
                        Konfigurasi dasar sistem
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <div className="font-medium text-[#001B34]">Nama Sistem</div>
                        <div className="text-sm text-slate-500">Poultrigo IoT Platform</div>
                      </div>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <div className="font-medium text-[#001B34]">Zona Waktu</div>
                        <div className="text-sm text-slate-500">Asia/Jakarta (WIB)</div>
                      </div>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <div className="font-medium text-[#001B34]">Bahasa Default</div>
                        <div className="text-sm text-slate-500">Bahasa Indonesia</div>
                      </div>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-6 text-lg text-[#001B34]">Log Aktivitas Sistem</h3>
                <div className="space-y-4">
                  {/* Log items would go here */}
                  <div className="text-center text-slate-500 py-8">
                    Log sistem akan muncul di sini
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#001B34]">
                  {modalMode === "create"
                    ? "Tambah Pengguna"
                    : modalMode === "edit"
                      ? "Edit Pengguna"
                      : "Detail Pengguna"}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama Lengkap
                  </label>
                  {modalMode === "view" ? (
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-900">
                      {selectedUser?.name}
                    </div>
                  ) : (
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-slate-900 focus:border-orange-500 focus:outline-none"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  {modalMode === "view" ? (
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-900">
                      {selectedUser?.email}
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-slate-900 focus:border-orange-500 focus:outline-none"
                        placeholder="nama@email.com"
                      />
                    </div>
                  )}
                </div>

                {modalMode !== "view" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Kata Sandi {modalMode === "edit" && "(Kosongkan jika tidak diubah)"}
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-10 text-slate-900 focus:border-orange-500 focus:outline-none"
                        placeholder="Minimal 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Peran Pengguna
                  </label>
                  {modalMode === "view" ? (
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-900">
                      {getRoleLabel(selectedUser?.role || "")}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "guest", label: "Guest" },
                        { id: "operator", label: "Operator" },
                        { id: "admin", label: "Admin" },
                      ].map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              role: role.id as "guest" | "operator" | "admin",
                            })
                          }
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${formData.role === role.id
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-slate-200 text-slate-600 hover:border-orange-200 hover:bg-orange-50/50"
                            }`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {modalMode === "view" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Terakhir Login
                      </label>
                      <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-900">
                        {formatDate(selectedUser?.last_login || "")}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Tanggal Dibuat
                      </label>
                      <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-900">
                        {new Date(selectedUser?.createdAt || "").toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Tutup
                </button>
                {modalMode !== "view" && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-2.5 font-medium text-white transition-all hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    Simpan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3 text-orange-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-bold text-[#001B34]">
                  {confirmModal.title}
                </h3>
              </div>

              <p className="mb-8 text-slate-600">
                {confirmModal.message}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={confirmModal.isLoading}
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 rounded-lg border border-slate-200 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={confirmModal.isLoading}
                  onClick={confirmModal.onConfirm}
                  className="flex-1 rounded-lg bg-orange-500 py-2.5 font-medium text-white transition-all hover:bg-orange-600 hover:shadow-lg disabled:opacity-50"
                >
                  {confirmModal.isLoading ? "Memproses..." : "Ya, Lanjutkan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
