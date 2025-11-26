"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Users as ChickensIcon,
  Bell,
  LogOut,
  Home,
  ShoppingCart,
  Package,
  Activity,
  Thermometer,
  Droplets,
  Clock,
  CheckCircle,
  Info,
  Menu,
  X,
  Newspaper,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ImageWithFallback from "@/components/shared/image-with-fallback";
import useIsClient from "@/hooks/use-is-client";
import { logout } from "@/utils/auth";

type GuestTab = "overview" | "products" | "orders";

export function GuestDashboard() {
  const router = useRouter();
  const isClient = useIsClient();
  const [activeTab, setActiveTab] = useState<GuestTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentStats = [
    {
      label: "Peternakan Aktif",
      value: "12",
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      label: "Total Ayam",
      value: "18,500",
      icon: ChickensIcon,
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
    {
      label: "Rata-rata Suhu",
      value: "28°C",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
    },
    {
      label: "Status Sistem",
      value: "Optimal",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
  ];

  const sensorData = [
    { time: "00:00", temp: 27, humidity: 68 },
    { time: "04:00", temp: 26, humidity: 70 },
    { time: "08:00", temp: 28, humidity: 65 },
    { time: "12:00", temp: 30, humidity: 62 },
    { time: "16:00", temp: 29, humidity: 64 },
    { time: "20:00", temp: 28, humidity: 67 },
  ];

  const farmOverview = [
    {
      id: 1,
      name: "Farm A - Kandang A1",
      population: 1500,
      age: 25,
      status: "Optimal",
      temp: "28°C",
    },
    {
      id: 2,
      name: "Farm A - Kandang A2",
      population: 1450,
      age: 20,
      status: "Baik",
      temp: "29°C",
    },
    {
      id: 3,
      name: "Farm B - Kandang B1",
      population: 1600,
      age: 30,
      status: "Optimal",
      temp: "27°C",
    },
    {
      id: 4,
      name: "Farm B - Kandang B2",
      population: 1550,
      age: 18,
      status: "Optimal",
      temp: "28°C",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "info",
      farm: "Farm A",
      message: "Jadwal pemberian pakan diperbarui",
      time: "10 menit lalu",
    },
    {
      id: 2,
      type: "success",
      farm: "Farm B",
      message: "Suhu optimal di semua kandang",
      time: "30 menit lalu",
    },
    {
      id: 3,
      type: "info",
      farm: "Farm A",
      message: "Data sensor baru tersedia",
      time: "1 jam lalu",
    },
  ];

  const availableProducts = [
    {
      id: 1,
      name: "Ayam Broiler (25 hari)",
      quantity: "500 pcs",
      price: "Rp 45,000/pc",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 2,
      name: "Ayam Layer (20 minggu)",
      quantity: "300 pcs",
      price: "Rp 65,000/pc",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 3,
      name: "Ayam Organik Free Range",
      quantity: "200 pcs",
      price: "Rp 85,000/pc",
      status: "Terbatas",
      image:
        "https://images.unsplash.com/photo-1594124440973-8111c8bb98b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  const myOrders = [
    {
      id: "#ORD-001",
      date: "2024-11-20",
      product: "Ayam Broiler",
      quantity: 100,
      status: "Terkirim",
      total: "Rp 4,500,000",
    },
    {
      id: "#ORD-002",
      date: "2024-11-18",
      product: "Ayam Layer",
      quantity: 50,
      status: "Sedang Diproses",
      total: "Rp 3,250,000",
    },
  ];

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Memuat ringkasan guest...
      </div>
    );
  }

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
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Poultrigo</div>
                  <div className="text-xs text-orange-100">Guest / Pembeli</div>
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
              { id: "overview", label: "Beranda", icon: Eye },
              { id: "products", label: "Produk", icon: Package },
              { id: "orders", label: "Pesanan Saya", icon: ShoppingCart },
              { id: "news", label: "Berita", icon: Newspaper, route: "/news" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if ("route" in tab && tab.route) {
                    router.push(tab.route);
                  } else {
                    setActiveTab(tab.id as GuestTab);
                    setSidebarOpen(false);
                  }
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
                  {activeTab === "products" && "Produk"}
                  {activeTab === "orders" && "Pesanan Saya"}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                  {activeTab === "overview" && "Portal pemantauan & pembelian"}
                  {activeTab === "products" && "Lihat produk dan harga"}
                  {activeTab === "orders" && "Kelola pesanan Anda"}
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
        <main className="p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
                {currentStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md lg:p-6"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="rounded-lg bg-slate-50 p-2">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mb-1 text-xl text-[#001B34] lg:text-2xl">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600 lg:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-[#001B34]">
                        Ikhtisar Suhu
                      </h3>
                      <p className="text-sm text-slate-600">
                        Pemantauan 24 jam terakhir
                      </p>
                    </div>
                    <Thermometer className="h-5 w-5 text-orange-500 lg:h-6 lg:w-6" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={sensorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#f97316"
                        fill="#fed7aa"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-[#001B34]">
                        Ikhtisar Kelembaban
                      </h3>
                      <p className="text-sm text-slate-600">
                        Pemantauan 24 jam terakhir
                      </p>
                    </div>
                    <Droplets className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={sensorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="humidity"
                        stroke="#3b82f6"
                        fill="#bfdbfe"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-4 lg:p-6">
                  <h3 className="text-lg text-[#001B34]">Ikhtisar Peternakan</h3>
                  <p className="text-sm text-slate-600">
                    Status semua peternakan saat ini (Hanya Baca)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Nama Peternakan", "Populasi", "Usia (hari)", "Suhu", "Status"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-4 py-3 text-left text-sm text-slate-600 lg:px-6"
                            >
                              {header}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {farmOverview.map((farm) => (
                        <tr key={farm.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-sm text-[#001B34] lg:px-6">
                            {farm.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {farm.population.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {farm.age} hari
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {farm.temp}
                          </td>
                          <td className="px-4 py-4 lg:px-6">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                                farm.status === "Optimal"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {farm.status === "Optimal" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Info className="h-3 w-3" />
                              )}
                              {farm.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg text-[#001B34]">
                      Peringatan & Pembaruan Terbaru
                    </h3>
                    <p className="text-sm text-slate-600">
                      Notifikasi sistem
                    </p>
                  </div>
                  <Bell className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                </div>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                    >
                      <div
                        className={`mt-2 h-2 w-2 rounded-full ${
                          alert.type === "success" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm text-[#001B34]">
                            {alert.farm}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
                <h3 className="text-lg text-[#001B34]">Produk Tersedia</h3>
                <p className="mb-6 text-sm text-slate-600">
                  Jelajahi dan beli ayam dari peternakan kami
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-lg"
                    >
                      <div className="relative h-48">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                        <div
                          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs ${
                            product.status === "Available"
                              ? "bg-green-500 text-white"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {product.status}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="mb-2 text-[#001B34]">{product.name}</h4>
                        <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                          <span>{product.quantity}</span>
                          <span className="text-orange-600">{product.price}</span>
                        </div>
                        <button
                          type="button"
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-2 text-white transition-all hover:shadow-lg hover:shadow-orange-500/30"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-4 lg:p-6">
                  <h3 className="text-lg text-[#001B34]">Pesanan Saya</h3>
                  <p className="text-sm text-slate-600">
                    Lacak riwayat pembelian Anda
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {["ID Pesanan", "Tanggal", "Produk", "Jumlah", "Total", "Status"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-4 py-3 text-left text-sm text-slate-600 lg:px-6"
                            >
                              {header}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {myOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-sm text-[#001B34] lg:px-6">
                            {order.id}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {order.date}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {order.product}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {order.quantity} pcs
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                            {order.total}
                          </td>
                          <td className="px-4 py-4 lg:px-6">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {order.status === "Delivered" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {myOrders.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  <h3 className="mb-2 text-lg text-[#001B34]">
                    Belum Ada Pesanan
                  </h3>
                  <p className="mb-6 text-sm text-slate-600">
                    Mulai jelajahi produk kami untuk melakukan pembelian pertama
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-white transition-all hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    Jelajahi Produk
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default GuestDashboard;

