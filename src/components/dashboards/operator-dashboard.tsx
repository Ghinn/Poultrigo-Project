"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Bell,
  BarChart3,
  Calendar,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Plus,
  Edit,
  Eye,
  ChevronRight,
  Home,
  Users as ChickensIcon,
  Gauge,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ImageWithFallback from "@/components/shared/image-with-fallback";
import useIsClient from "@/hooks/use-is-client";

export function OperatorDashboard() {
  const router = useRouter();
  const isClient = useIsClient();
  const [activeTab, setActiveTab] = useState<
    "overview" | "kandang" | "monitoring" | "daily" | "reports"
  >("overview");

  const sensorData = [
    { time: "00:00", temp: 27, humidity: 68, ammonia: 15 },
    { time: "04:00", temp: 26, humidity: 70, ammonia: 18 },
    { time: "08:00", temp: 28, humidity: 65, ammonia: 20 },
    { time: "12:00", temp: 30, humidity: 62, ammonia: 22 },
    { time: "16:00", temp: 29, humidity: 64, ammonia: 19 },
    { time: "20:00", temp: 28, humidity: 67, ammonia: 17 },
  ];

  const kandangData = [
    {
      id: "A1",
      name: "Kandang A1",
      population: 1500,
      age: 25,
      status: "Optimal",
      temp: "28°C",
      humidity: "65%",
    },
    {
      id: "A2",
      name: "Kandang A2",
      population: 1450,
      age: 20,
      status: "Warning",
      temp: "31°C",
      humidity: "70%",
    },
    {
      id: "B1",
      name: "Kandang B1",
      population: 1600,
      age: 30,
      status: "Optimal",
      temp: "27°C",
      humidity: "63%",
    },
    {
      id: "B2",
      name: "Kandang B2",
      population: 1550,
      age: 18,
      status: "Optimal",
      temp: "28°C",
      humidity: "66%",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      kandang: "Kandang A2",
      message: "Temperature above normal (31°C)",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "info",
      kandang: "Kandang B1",
      message: "Feeding time approaching",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "warning",
      kandang: "Kandang A2",
      message: "Humidity high (70%)",
      time: "30 min ago",
    },
  ];

  const dailyTasks = [
    {
      id: 1,
      task: "Pemberian pakan pagi",
      kandang: "Semua Kandang",
      time: "06:00",
      status: "Done",
    },
    {
      id: 2,
      task: "Cek kondisi air minum",
      kandang: "Kandang A1, A2",
      time: "08:00",
      status: "Done",
    },
    {
      id: 3,
      task: "Pembersihan kandang",
      kandang: "Kandang B1",
      time: "10:00",
      status: "Pending",
    },
    {
      id: 4,
      task: "Pemberian pakan siang",
      kandang: "Semua Kandang",
      time: "12:00",
      status: "Pending",
    },
  ];

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Memuat dashboard operator...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-[#001B34]">Operator Kandang</div>
                <div className="text-sm text-slate-500">
                  Farm Management Dashboard
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative rounded-lg p-2 transition-colors hover:bg-slate-100"
              >
                <Bell className="h-6 w-6 text-slate-600" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <div className="px-6">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Ikhtisar", icon: Gauge },
              { id: "kandang", label: "Kelola Kandang", icon: Home },
              { id: "monitoring", label: "Monitoring Sensor", icon: Activity },
              { id: "daily", label: "Data Harian", icon: Calendar },
              { id: "reports", label: "Laporan", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-4 py-4 transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Kandang",
                  value: "4",
                  icon: Home,
                  color: "bg-orange-500",
                  trend: "Aktif",
                },
                {
                  label: "Total Populasi",
                  value: "6,100",
                  icon: ChickensIcon,
                  color: "bg-blue-500",
                  trend: "+150",
                },
                {
                  label: "Rata-rata Usia",
                  value: "23 hari",
                  icon: Calendar,
                  color: "bg-green-500",
                  trend: "Normal",
                },
                {
                  label: "Status Sistem",
                  value: "Optimal",
                  icon: Activity,
                  color: "bg-purple-500",
                  trend: "99.8%",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm text-green-600">{stat.trend}</span>
                  </div>
                  <div className="mb-1 text-3xl text-[#001B34]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg text-[#001B34]">
                      Monitoring Sensor Real-Time
                    </h3>
                    <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none">
                      <option>Kandang A1</option>
                      <option>Kandang A2</option>
                      <option>Kandang B1</option>
                      <option>Kandang B2</option>
                    </select>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    {[
                      {
                        label: "Suhu",
                        value: "28°C",
                        icon: Thermometer,
                        color: "text-orange-500",
                        status: "Normal",
                      },
                      {
                        label: "Kelembaban",
                        value: "65%",
                        icon: Droplets,
                        color: "text-blue-500",
                        status: "Normal",
                      },
                      {
                        label: "Amonia",
                        value: "Low",
                        icon: Wind,
                        color: "text-green-500",
                        status: "Optimal",
                      },
                    ].map((sensor) => (
                      <div
                        key={sensor.label}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <sensor.icon
                          className={`mb-2 h-6 w-6 ${sensor.color}`}
                        />
                        <div className="mb-1 text-sm text-slate-600">
                          {sensor.label}
                        </div>
                        <div className="mb-1 text-2xl text-[#001B34]">
                          {sensor.value}
                        </div>
                        <div className="text-xs text-green-600">
                          {sensor.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={sensorData}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#f97316"
                        fillOpacity={1}
                        fill="url(#tempGradient)"
                        name="Suhu (°C)"
                      />
                      <Area
                        type="monotone"
                        dataKey="humidity"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#humidityGradient)"
                        name="Kelembaban (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1694854038360-56b29a16fb0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Farm Overview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-sm">Live Farm View</div>
                      <div className="text-lg">
                        Kandang A1 - Active Operations
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg text-[#001B34]">Alert Terbaru</h3>
                    <Bell className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`rounded-lg border-l-4 p-3 ${
                          alert.type === "warning"
                            ? "border-orange-500 bg-orange-50"
                            : "border-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className={`mt-0.5 h-4 w-4 ${
                              alert.type === "warning"
                                ? "text-orange-500"
                                : "text-blue-500"
                            }`}
                          />
                          <div>
                            <div className="text-xs text-slate-500">
                              {alert.kandang}
                            </div>
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

                <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                  <h3 className="mb-4 text-lg">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Update Data Harian", icon: ClipboardList },
                      { label: "Tambah Kandang", icon: Plus },
                      { label: "Lihat Laporan", icon: BarChart3 },
                    ].map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        <action.icon className="h-5 w-5" />
                        <span>{action.label}</span>
                        <ChevronRight className="ml-auto h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "kandang" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#001B34]">Kelola Kandang</h2>
                <p className="text-slate-600">
                  Manajemen data kandang dan populasi ayam
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Tambah Kandang
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {kandangData.map((kandang) => (
                <div
                  key={kandang.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                        <Home className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-lg text-[#001B34]">
                          {kandang.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {kandang.id}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        kandang.status === "Optimal"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {kandang.status}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    {[
                      { label: "Populasi", value: kandang.population.toLocaleString() },
                      { label: "Usia", value: `${kandang.age} hari` },
                      { label: "Suhu", value: kandang.temp },
                      { label: "Kelembaban", value: kandang.humidity },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600"
                      >
                        <div className="mb-1">{item.label}</div>
                        <div className="text-xl text-[#001B34]">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 transition-colors hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </button>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-orange-600 transition-colors hover:bg-orange-100"
                    >
                      <Edit className="h-4 w-4" />
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "monitoring" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-[#001B34]">Monitoring Sensor</h2>
              <p className="text-slate-600">
                Monitor kondisi sensor secara real-time
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Suhu Rata-rata",
                  value: "28.5°C",
                  icon: Thermometer,
                  color: "bg-orange-500",
                  status: "Normal",
                },
                {
                  label: "Kelembaban",
                  value: "65.2%",
                  icon: Droplets,
                  color: "bg-blue-500",
                  status: "Normal",
                },
                {
                  label: "Level Amonia",
                  value: "Low",
                  icon: Wind,
                  color: "bg-green-500",
                  status: "Optimal",
                },
                {
                  label: "Sensor Aktif",
                  value: "12/12",
                  icon: Activity,
                  color: "bg-purple-500",
                  status: "Online",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${metric.color}`}
                  >
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mb-1 text-sm text-slate-600">
                    {metric.label}
                  </div>
                  <div className="mb-1 text-2xl text-[#001B34]">
                    {metric.value}
                  </div>
                  <div className="text-sm text-green-600">{metric.status}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg text-[#001B34]">Tren Sensor 24 Jam</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={sensorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Suhu (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Kelembaban (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="ammonia"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Amonia (ppm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "daily" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#001B34]">Data Harian</h2>
                <p className="text-slate-600">
                  Pencatatan aktivitas harian kandang
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Tambah Catatan
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-4 border-b border-slate-200 p-4">
                <Calendar className="h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  className="rounded-lg border border-slate-200 px-3 py-2 focus:border-orange-500 focus:outline-none"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="divide-y divide-slate-200">
                {dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-6 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          task.status === "Done"
                            ? "bg-green-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <ClipboardList
                          className={`h-5 w-5 ${
                            task.status === "Done"
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <div className="text-[#001B34]">{task.task}</div>
                            <div className="text-sm text-slate-600">
                              {task.kandang}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              task.status === "Done"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Waktu: {task.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-[#001B34]">Laporan & Analitik</h2>
              <p className="text-slate-600">Visualisasi performa kandang</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  label: "Efisiensi Pakan",
                  value: "92%",
                  change: "+5%",
                  color: "text-green-500",
                },
                {
                  label: "Tingkat Mortalitas",
                  value: "1.2%",
                  change: "-0.3%",
                  color: "text-green-500",
                },
                {
                  label: "Rata-rata Berat",
                  value: "1.8 kg",
                  change: "+0.2 kg",
                  color: "text-green-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div className="mb-2 text-sm text-slate-600">
                    {stat.label}
                  </div>
                  <div className="mb-2 text-3xl text-[#001B34]">
                    {stat.value}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.color}`}>
                    <TrendingUp className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-6 text-lg text-[#001B34]">
                Tren Populasi & Pertumbuhan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { week: "Week 1", population: 6000, weight: 0.8 },
                    { week: "Week 2", population: 5950, weight: 1.2 },
                    { week: "Week 3", population: 5900, weight: 1.6 },
                    { week: "Week 4", population: 5850, weight: 2.0 },
                  ]}
                >
                  <defs>
                    <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="population"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#popGradient)"
                    name="Populasi"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OperatorDashboard;

