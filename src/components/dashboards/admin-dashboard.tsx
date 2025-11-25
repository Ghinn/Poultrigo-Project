"use client";

import { useState } from "react";
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
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react";

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "sensors" | "system" | "logs"
  >("overview");

  const stats = [
    {
      label: "Total Pengguna",
      value: "24",
      change: "+3",
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

  const users = [
    {
      id: 1,
      name: "Ahmad Operator",
      email: "ahmad@farm1.com",
      role: "Operator",
      status: "Aktif",
      lastLogin: "2 menit lalu",
    },
    {
      id: 2,
      name: "Budi Operator",
      email: "budi@farm2.com",
      role: "Operator",
      status: "Aktif",
      lastLogin: "15 menit lalu",
    },
    {
      id: 3,
      name: "Siti Guest",
      email: "siti@email.com",
      role: "Guest",
      status: "Aktif",
      lastLogin: "1 jam lalu",
    },
    {
      id: 4,
      name: "Deni Admin",
      email: "deni@poultrigo.com",
      role: "Admin",
      status: "Aktif",
      lastLogin: "5 jam lalu",
    },
  ];

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
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#001B34] to-[#003561]">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-[#001B34]">Admin Developer</div>
                <div className="text-sm text-slate-500">
                  Panel Pengelolaan Sistem
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 transition-colors hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <div className="px-6">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Ikhtisar", icon: Activity },
              { id: "users", label: "Kelola Pengguna", icon: Users },
              { id: "sensors", label: "Konfigurasi Sensor", icon: Wifi },
              { id: "system", label: "Pengaturan Sistem", icon: Settings },
              { id: "logs", label: "Log Sistem", icon: Terminal },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-4 py-4 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#001B34] text-[#001B34]"
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#001B34]">Kelola Pengguna</h2>
                <p className="text-slate-600">
                  Atur dan pantau seluruh akun pengguna sistem
                </p>
              </div>
              <button
                type="button"
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
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-[#001B34] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="ml-4 flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50"
                >
                  <Filter className="h-5 w-5 text-slate-600" />
                  Saring
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      {[
                        "Nama",
                        "Email",
                        "Peran",
                        "Status",
                        "Login Terakhir",
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
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-[#001B34]">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs ${
                              user.role === "Admin"
                                ? "bg-[#001B34] text-white"
                                : user.role === "Operator"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded p-1.5 text-orange-600 hover:bg-orange-50"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded p-1.5 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sensors" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#001B34]">Konfigurasi Sensor</h2>
                <p className="text-slate-600">Kelola dan konfigurasi sensor IoT</p>
              </div>
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

        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#001B34]">Log Sistem</h2>
                <p className="text-slate-600">
                  Pemantauan aktivitas sistem secara real-time
                </p>
              </div>
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
    </div>
  );
}

export default AdminDashboard;

