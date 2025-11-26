"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
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
  Phone,
  Lock,
  User as UserIcon,
  Save,
  Bell,
  Download,
  Upload,
  Globe,
  Key,
  ShieldCheck,
  Menu,
  Newspaper,
} from "lucide-react";
import {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  logout,
  type User,
} from "@/utils/auth";
import { NewsManagement } from "./news-management";

type ModalMode = "create" | "edit" | "view" | null;

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "news" | "sensors" | "system" | "logs"
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
    phone: "",
    password: "",
    role: "guest" as "guest" | "operator" | "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load users from localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    {
      label: "Total Pengguna",
      value: users.length.toString(),
      change: `+${users.filter((u) => new Date(u.createdAt) > new Date(Date.now() - 86400000)).length}`,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
    },
    {
      label: "Sensor Aktif",
      value: "156",
      change: "+12",
      icon: Activity,
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
  ];

  // CRUD Functions
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
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
      phone: user.phone,
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
      phone: "",
      password: "",
      role: "guest",
    });
    setError("");
  };

  const handleSave = () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Nama lengkap wajib diisi");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email wajib diisi");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Nomor telepon wajib diisi");
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

    if (modalMode === "create") {
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (existingUser) {
        setError("Email sudah terdaftar");
        return;
      }
      saveUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
    } else if (modalMode === "edit" && selectedUser) {
      const updateData: Partial<Omit<User, "id" | "createdAt">> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };
      if (formData.password.trim()) {
        if (formData.password.length < 8) {
          setError("Kata sandi minimal 8 karakter");
          return;
        }
        updateData.password = formData.password;
      }
      if (formData.email.toLowerCase() !== selectedUser.email.toLowerCase()) {
        const existingUser = users.find(
          (u) => u.email.toLowerCase() === formData.email.toLowerCase()
        );
        if (existingUser) {
          setError("Email sudah terdaftar");
          return;
        }
      }
      updateUser(selectedUser.id, updateData);
    }

    loadUsers();
    handleCloseModal();
  };

  const handleDelete = (userId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      deleteUser(userId);
      loadUsers();
      if (selectedUser?.id === userId) {
        handleCloseModal();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return date.toLocaleDateString("id-ID");
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

  const systemLogs = [
    {
      time: "10:45:32",
      type: "INFO",
      message: 'Pengguna "ahmad@farm1.com" berhasil masuk',
      source: "AUTH",
    },
    {
      time: "10:43:15",
      type: "WARNING",
      message: "Sensor S003 mendeteksi amonia tinggi",
      source: "SENSOR",
    },
    {
      time: "10:40:22",
      type: "ERROR",
      message: "Sensor S004 terputus dari jaringan",
      source: "SENSOR",
    },
    {
      time: "10:35:18",
      type: "INFO",
      message: "Pencadangan sistem selesai",
      source: "SYSTEM",
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
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-gradient-to-b from-orange-500 to-orange-600 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-b border-orange-400/30 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors sm:px-4 sm:py-3 ${
                  activeTab === tab.id
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
              onClick={() => {
                logout();
                router.push("/");
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
                  {activeTab === "news" && "Kelola Berita"}
                  {activeTab === "sensors" && "Konfigurasi Sensor"}
                  {activeTab === "system" && "Pengaturan Sistem"}
                  {activeTab === "logs" && "Log Sistem"}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                  {activeTab === "overview" && "Ringkasan sistem dan aktivitas"}
                  {activeTab === "users" && "Atur dan pantau seluruh akun pengguna sistem"}
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
                      className={`rounded-lg border-l-4 p-4 ${
                        alert.type === "error"
                          ? "border-red-500 bg-red-50"
                          : alert.type === "warning"
                            ? "border-orange-500 bg-orange-50"
                            : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={`mt-0.5 h-5 w-5 ${
                            alert.type === "error"
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
                        "Telepon",
                        "Peran",
                        "Tanggal Dibuat",
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
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
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
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs ${
                                user.role === "admin"
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
                            {formatDate(user.createdAt)}
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
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        sensor.status === "Online"
                          ? "bg-green-100"
                          : sensor.status === "Warning"
                            ? "bg-orange-100"
                            : "bg-red-100"
                      }`}
                    >
                      <Activity
                        className={`h-5 w-5 ${
                          sensor.status === "Online"
                            ? "text-green-600"
                            : sensor.status === "Warning"
                              ? "text-orange-600"
                              : "text-red-600"
                        }`}
                      />
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        sensor.status === "Online"
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

              {/* Notifikasi & Alert */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#001B34]">
                      Notifikasi & Alert
                    </h3>
                    <p className="text-sm text-slate-500">Konfigurasi peringatan sistem</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Email Notifikasi</div>
                      <div className="text-sm text-slate-500">Kirim peringatan via email</div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Peringatan Sensor Offline</div>
                      <div className="text-sm text-slate-500">Alert jika sensor mati</div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#001B34]">Backup & Restore</h3>
                    <p className="text-sm text-slate-500">Cadangan data sistem</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium text-[#001B34]">Backup Terakhir</div>
                      <span className="text-xs text-green-600">Berhasil</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date().toLocaleString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg">
                      <Download className="mr-2 inline h-4 w-4" />
                      Buat Backup
                    </button>
                    <button type="button" className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                      <Database className="mr-2 inline h-4 w-4" />
                      Restore
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Auto Backup Harian</div>
                      <div className="text-sm text-slate-500">Setiap pukul 02:00 WIB</div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Keamanan */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <ShieldCheck className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#001B34]">Keamanan Sistem</h3>
                    <p className="text-sm text-slate-500">Pengaturan keamanan dan akses</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-500">Tambah lapisan keamanan</div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Session Timeout</div>
                      <div className="text-sm text-slate-500">30 menit</div>
                    </div>
                    <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Integrasi API */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#001B34]">Integrasi API</h3>
                    <p className="text-sm text-slate-500">Konfigurasi API endpoint</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-medium text-[#001B34]">API Base URL</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-white px-3 py-2 text-sm text-slate-600">
                        https://api.poultrigo.com/v1
                      </code>
                      <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">API Key</div>
                      <div className="text-sm text-slate-500">••••••••••••••••••</div>
                    </div>
                    <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      <Key className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Konfigurasi Sensor */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <Activity className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#001B34]">Konfigurasi Sensor</h3>
                    <p className="text-sm text-slate-500">Pengaturan interval pembacaan sensor</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Interval Pembacaan</div>
                      <div className="text-sm text-slate-500">5 detik</div>
                    </div>
                    <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                    <div>
                      <div className="font-medium text-[#001B34]">Timeout Sensor</div>
                      <div className="text-sm text-slate-500">30 detik</div>
                    </div>
                    <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button type="button" className="rounded-lg border border-slate-200 px-6 py-2.5 text-slate-600 transition-all hover:bg-slate-50">
                Batal
              </button>
              <button type="button" className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 font-medium text-white transition-all hover:shadow-lg">
                <Save className="mr-2 inline h-4 w-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 hover:bg-slate-50"
              >
                <RefreshCw className="h-5 w-5" />
                Muat Ulang
              </button>
            </div>

            <div className="rounded-xl bg-[#001B34] p-6 font-mono text-sm text-green-400">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-3 text-white">
                <Terminal className="h-5 w-5" />
                Konsol Sistem
              </div>
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.message} className="flex gap-4">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span
                      className={
                        log.type === "ERROR"
                          ? "text-red-400"
                          : log.type === "WARNING"
                            ? "text-orange-400"
                            : "text-green-400"
                      }
                    >
                      [{log.type}]
                    </span>
                    <span className="text-slate-400">[{log.source}]</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Create/Edit/View User */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-[#001B34]">
                {modalMode === "create"
                  ? "Tambah Pengguna Baru"
                  : modalMode === "edit"
                    ? "Edit Pengguna"
                    : "Detail Pengguna"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              {modalMode === "view" && selectedUser ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">Nama Lengkap</label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#001B34]">
                        {selectedUser.name}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">Email</label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#001B34]">
                        {selectedUser.email}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">Nomor Telepon</label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#001B34]">
                        {selectedUser.phone}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">Peran</label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs ${
                            selectedUser.role === "admin"
                              ? "bg-[#001B34] text-white"
                              : selectedUser.role === "operator"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {getRoleLabel(selectedUser.role)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">Tanggal Dibuat</label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#001B34]">
                        {new Date(selectedUser.createdAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">ID Pengguna</label>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                        {selectedUser.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(selectedUser)}
                      className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                    >
                      Edit Pengguna
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedUser.id)}
                      className="flex-1 rounded-lg border border-red-500 bg-white px-4 py-2.5 text-red-600 transition-all hover:bg-red-50"
                    >
                      Hapus Pengguna
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-4 top-1/2 z-40 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        className="relative z-30 w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 caret-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Alamat Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@perusahaan.com"
                        className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 caret-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+62 xxx xxxx xxxx"
                        className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 caret-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Peran <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "guest" | "operator" | "admin",
                        })
                      }
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="guest">Guest / Pembeli</option>
                      <option value="operator">Operator Kandang</option>
                      <option value="admin">Admin Developer</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">
                      Peran menentukan akses pengguna ke fitur sistem
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Kata Sandi{" "}
                      {modalMode === "create" ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="text-slate-400">(Kosongkan jika tidak diubah)</span>
                      )}
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required={modalMode === "create"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={
                          modalMode === "create"
                            ? "Minimal 8 karakter"
                            : "Kosongkan jika tidak ingin mengubah"
                        }
                        className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 caret-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 transition-all hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                    >
                      <Save className="mr-2 inline h-4 w-4" />
                      {modalMode === "create" ? "Tambah Pengguna" : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default AdminDashboard;

