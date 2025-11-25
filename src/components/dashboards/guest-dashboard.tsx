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

type GuestTab = "overview" | "products" | "orders";

export function GuestDashboard() {
  const router = useRouter();
  const isClient = useIsClient();
  const [activeTab, setActiveTab] = useState<GuestTab>("overview");

  const currentStats = [
    {
      label: "Active Farms",
      value: "12",
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      label: "Total Chickens",
      value: "18,500",
      icon: ChickensIcon,
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
    {
      label: "Avg. Temperature",
      value: "28°C",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
    },
    {
      label: "System Status",
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
      status: "Good",
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
      message: "Feeding schedule updated",
      time: "10 min ago",
    },
    {
      id: 2,
      type: "success",
      farm: "Farm B",
      message: "Temperature optimal across all coops",
      time: "30 min ago",
    },
    {
      id: 3,
      type: "info",
      farm: "Farm A",
      message: "New sensor data available",
      time: "1 hour ago",
    },
  ];

  const availableProducts = [
    {
      id: 1,
      name: "Broiler Chickens (25 days)",
      quantity: "500 pcs",
      price: "Rp 45,000/pc",
      status: "Available",
      image:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 2,
      name: "Layer Chickens (20 weeks)",
      quantity: "300 pcs",
      price: "Rp 65,000/pc",
      status: "Available",
      image:
        "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: 3,
      name: "Free Range Organic",
      quantity: "200 pcs",
      price: "Rp 85,000/pc",
      status: "Limited",
      image:
        "https://images.unsplash.com/photo-1594124440973-8111c8bb98b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  const myOrders = [
    {
      id: "#ORD-001",
      date: "2024-11-20",
      product: "Broiler Chickens",
      quantity: 100,
      status: "Delivered",
      total: "Rp 4,500,000",
    },
    {
      id: "#ORD-002",
      date: "2024-11-18",
      product: "Layer Chickens",
      quantity: 50,
      status: "Processing",
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
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 lg:h-12 lg:w-12">
                <Eye className="h-5 w-5 text-white lg:h-6 lg:w-6" />
              </div>
              <div>
                <div className="text-[#001B34]">Guest / Buyer</div>
                <div className="text-xs text-slate-500 lg:text-sm">
                  Monitoring & Purchase Portal
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                type="button"
                className="relative rounded-lg p-2 transition-colors hover:bg-slate-100"
              >
                <Bell className="h-5 w-5 text-slate-600 lg:h-6 lg:w-6" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:text-red-600 lg:px-4 lg:text-base"
              >
                <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <div className="px-4 lg:px-6">
          <div className="flex gap-4 overflow-x-auto lg:gap-8">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "My Orders", icon: ShoppingCart },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as GuestTab)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors lg:px-4 lg:py-4 lg:text-base ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-4 py-6 lg:px-6">
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
                        Temperature Overview
                      </h3>
                      <p className="text-sm text-slate-600">
                        Last 24 hours monitoring
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
                        Humidity Overview
                      </h3>
                      <p className="text-sm text-slate-600">
                        Last 24 hours monitoring
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
                  <h3 className="text-lg text-[#001B34]">Farm Overview</h3>
                  <p className="text-sm text-slate-600">
                    Current status of all farms (Read-only)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Farm Name", "Population", "Age (days)", "Temperature", "Status"].map(
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
                            {farm.age} days
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
                      Recent Alerts & Updates
                    </h3>
                    <p className="text-sm text-slate-600">
                      System notifications
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
                <h3 className="text-lg text-[#001B34]">Available Products</h3>
                <p className="mb-6 text-sm text-slate-600">
                  Browse and purchase chickens from our farms
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
                          Add to Cart
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
                  <h3 className="text-lg text-[#001B34]">My Orders</h3>
                  <p className="text-sm text-slate-600">
                    Track your purchase history
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Order ID", "Date", "Product", "Quantity", "Total", "Status"].map(
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
                    No Orders Yet
                  </h3>
                  <p className="mb-6 text-sm text-slate-600">
                    Start browsing our products to make your first purchase
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-white transition-all hover:shadow-lg hover:shadow-orange-500/30"
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GuestDashboard;

