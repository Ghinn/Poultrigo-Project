"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Bell,
  BarChart3,
  Calendar,
  ClipboardList,
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
  Trash2,
  X,
  Save,
  Menu,
  Newspaper,
  Cpu,
  Power,
  Battery,
  Wifi,
  Calculator,
  Printer,
  FileText,
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
import {
  getKandangs,
  saveKandang,
  updateKandang,
  deleteKandang,
  getDailyRecords,
  saveDailyRecord,
  updateDailyRecord,
  deleteDailyRecord,
  getKandangHistory,
  type Kandang,
  type DailyRecord,
  type KandangHistory,
  getDevices,
  saveDevice,
  updateDevice,
  deleteDevice,
  type Device,
  getPredictions,
  savePrediction,
  type PredictionRecord,
} from "@/utils/operator-data";
import { logout } from "@/actions/auth";
import { setCurrentUser } from "@/utils/auth";

type ModalMode = "create-kandang" | "edit-kandang" | "view-kandang" | "create-daily" | "edit-daily" | "create-device" | null;

export function OperatorDashboard() {
  const router = useRouter();
  const isClient = useIsClient();
  const [activeTab, setActiveTab] = useState<
    "overview" | "kandang" | "daily" | "reports" | "news" | "devices" | "prediction"
  >("overview");

  // CRUD State for Kandang
  const [kandangs, setKandangs] = useState<Kandang[]>(() => {
    if (typeof window !== "undefined") {
      return getKandangs();
    }
    return [];
  });
  const [selectedKandang, setSelectedKandang] = useState<Kandang | null>(null);
  const [kandangFormData, setKandangFormData] = useState({
    name: "",
    population: 0,
    age: 0,
    status: "Optimal" as "Optimal" | "Peringatan" | "Kritis",
  });

  // CRUD State for Daily Records
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(() => {
    if (typeof window !== "undefined") {
      return getDailyRecords();
    }
    return [];
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedRecord, setSelectedRecord] = useState<DailyRecord | null>(null);
  const [recordFormData, setRecordFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    kandangId: "",
    kandangName: "",
    task: "",
    time: "",
    status: "Menunggu" as "Selesai" | "Menunggu" | "Terlewat",
    notes: "",
  });

  // Load functions for manual refresh
  const loadKandangs = useCallback(() => {
    if (isClient) {
      setKandangs(getKandangs());
    }
  }, [isClient]);

  const loadDailyRecords = useCallback(() => {
    if (isClient) {
      setDailyRecords(getDailyRecords());
    }
  }, [isClient]);

  // History State
  const loadHistoryAndPredictions = useCallback(() => {
    if (isClient) {
      setHistory(getKandangHistory());
      setPredictions(getPredictions());
    }
  }, [isClient]);

  const [history, setHistory] = useState<KandangHistory[]>(() => {
    if (typeof window !== "undefined") {
      return getKandangHistory();
    }
    return [];
  });

  // Device State
  const loadDevices = useCallback(() => {
    if (isClient) {
      setDevices(getDevices());
    }
  }, [isClient]);

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm("Hapus perangkat ini?")) {
      deleteDevice(deviceId);
      loadDevices();
    }
  };

  const [devices, setDevices] = useState<Device[]>(() => {
    if (typeof window !== "undefined") {
      return getDevices();
    }
    return [];
  });
  const [deviceFormData, setDeviceFormData] = useState({
    name: "",
    type: "Feeder" as "Feeder" | "Waterer" | "Cleaner" | "Sensor",
    kandangId: "",
  });

  // Prediction State
  const [predictions, setPredictions] = useState<PredictionRecord[]>(() => {
    if (typeof window !== "undefined") {
      return getPredictions();
    }
    return [];
  });
  const [predictionForm, setPredictionForm] = useState({
    kandangId: "",
    age: 0,
    gender: "Jantan" as "Jantan" | "Betina",
    population: 0,
    feedYesterday: 0,
    leftover: 0,
  });
  const [predictionResult, setPredictionResult] = useState<number | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Memuat dashboard operator...
      </div>
    );
  }

  const sensorData = [
    { time: "00:00", temp: 27, humidity: 68, ammonia: 15 },
    { time: "04:00", temp: 26, humidity: 70, ammonia: 18 },
    { time: "08:00", temp: 28, humidity: 65, ammonia: 20 },
    { time: "12:00", temp: 30, humidity: 62, ammonia: 22 },
    { time: "16:00", temp: 29, humidity: 64, ammonia: 19 },
    { time: "20:00", temp: 28, humidity: 67, ammonia: 17 },
  ];

  // Filter daily records by selected date
  const filteredDailyRecords = dailyRecords.filter((r) => r.date === selectedDate);

  const alerts = [
    {
      id: 1,
      type: "warning",
      kandang: "Kandang A2",
      message: "Suhu di atas normal (31°C)",
      time: "5 menit lalu",
    },
    {
      id: 2,
      type: "info",
      kandang: "Kandang B1",
      message: "Waktu pemberian pakan akan segera tiba",
      time: "15 menit lalu",
    },
    {
      id: 3,
      type: "warning",
      kandang: "Kandang A2",
      message: "Kelembaban tinggi (70%)",
      time: "30 menit lalu",
    },
  ];

  // CRUD Functions for Kandang
  const handleOpenCreateKandang = () => {
    setKandangFormData({
      name: "",
      population: 0,
      age: 0,
      status: "Optimal",
    });
    setSelectedKandang(null);
    setModalMode("create-kandang");
    setError("");
  };

  const handleOpenEditKandang = (kandang: Kandang) => {
    setKandangFormData({
      name: kandang.name,
      population: kandang.population,
      age: kandang.age,
      status: kandang.status,
    });
    setSelectedKandang(kandang);
    setModalMode("edit-kandang");
    setError("");
  };

  const handleOpenViewKandang = (kandang: Kandang) => {
    setSelectedKandang(kandang);
    setModalMode("view-kandang");
  };

  const handleSaveKandang = () => {
    setError("");

    if (!kandangFormData.name.trim()) {
      setError("Nama kandang wajib diisi");
      return;
    }
    if (kandangFormData.population <= 0) {
      setError("Populasi harus lebih dari 0");
      return;
    }
    if (kandangFormData.age < 0) {
      setError("Usia tidak boleh negatif");
      return;
    }

    if (modalMode === "create-kandang") {
      saveKandang(kandangFormData);
    } else if (modalMode === "edit-kandang" && selectedKandang) {
      updateKandang(selectedKandang.id, kandangFormData);
    }

    loadKandangs();
    loadHistoryAndPredictions(); // Refresh history
    setModalMode(null);
    setSelectedKandang(null);
  };

  const handleDeleteKandang = (kandangId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kandang ini?")) {
      deleteKandang(kandangId);
      loadKandangs();
      if (selectedKandang?.id === kandangId) {
        setModalMode(null);
        setSelectedKandang(null);
      }
    }
  };

  // CRUD Functions for Daily Records
  const handleOpenCreateDaily = () => {
    // Get current time in HH:MM format
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setRecordFormData({
      date: selectedDate,
      kandangId: "",
      kandangName: "",
      task: "",
      time: currentTime, // Auto-fill with current system time
      status: "Menunggu",
      notes: "",
    });
    setSelectedRecord(null);
    setModalMode("create-daily");
    setError("");
  };

  const handleOpenEditDaily = (record: DailyRecord) => {
    setRecordFormData({
      date: record.date,
      kandangId: record.kandangId,
      kandangName: record.kandangName,
      task: record.task,
      time: record.time,
      status: record.status,
      notes: record.notes || "",
    });
    setSelectedRecord(record);
    setModalMode("edit-daily");
    setError("");
  };

  const handleSaveDailyRecord = () => {
    setError("");

    if (!recordFormData.task.trim()) {
      setError("Nama tugas wajib diisi");
      return;
    }
    if (!recordFormData.kandangId) {
      setError("Pilih kandang");
      return;
    }
    if (!recordFormData.time.trim()) {
      setError("Waktu wajib diisi");
      return;
    }

    if (modalMode === "create-daily") {
      saveDailyRecord(recordFormData);
    } else if (modalMode === "edit-daily" && selectedRecord) {
      updateDailyRecord(selectedRecord.id, recordFormData);
    }

    loadDailyRecords();
    setModalMode(null);
    setSelectedRecord(null);
  };

  const handleDeleteDailyRecord = (recordId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      deleteDailyRecord(recordId);
      loadDailyRecords();
      if (selectedRecord?.id === recordId) {
        setModalMode(null);
        setSelectedRecord(null);
      }
    }
  };

  // Device CRUD
  const handleOpenCreateDevice = () => {
    setDeviceFormData({
      name: "",
      type: "Feeder",
      kandangId: kandangs.length > 0 ? kandangs[0].id : "",
    });
    setModalMode("create-device");
    setError("");
  };

  const handleSaveDevice = () => {
    setError("");
    if (!deviceFormData.name.trim()) {
      setError("Nama perangkat wajib diisi");
      return;
    }
    if (!deviceFormData.kandangId) {
      setError("Pilih kandang untuk perangkat ini");
      return;
    }

    saveDevice({
      ...deviceFormData,
      status: "Inactive",
      batteryLevel: 100,
      lastActive: new Date().toISOString(),
    });

    loadDevices();
    setModalMode(null);
  };

  const handleToggleDeviceStatus = (device: Device) => {
    const newStatus = device.status === "Active" ? "Inactive" : "Active";
    updateDevice(device.id, {
      status: newStatus,
      lastActive: new Date().toISOString(),
    });
    loadDevices();
  };

  // Prediction Logic
  const handleCalculatePrediction = () => {
    setError("");
    if (!predictionForm.kandangId) {
      setError("Pilih kandang terlebih dahulu");
      return;
    }
    if (predictionForm.population <= 0) {
      setError("Populasi harus lebih dari 0");
      return;
    }

    // Mock Prediction Logic: (Population * 0.12) - Leftover
    // In real app, this would call the ML API
    const baseNeed = predictionForm.gender === "Jantan" ? 0.12 : 0.11;
    const predictedAmount = Math.round((predictionForm.population * baseNeed) - predictionForm.leftover);

    setPredictionResult(predictedAmount);

    // Save to history
    const kandangName = kandangs.find(k => k.id === predictionForm.kandangId)?.name || "Unknown";
    savePrediction({
      date: new Date().toISOString(),
      kandangId: predictionForm.kandangId,
      kandangName: kandangName,
      inputs: predictionForm,
      result: predictedAmount,
    });

    // Reload predictions for report
    if (isClient) {
      setPredictions(getPredictions());
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedKandang(null);
    setSelectedRecord(null);
    setError("");
  };

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
                  src="/Logo/Logo Poultrigo_Navy_Primary.svg"
                  alt="Poultrigo"
                  width={140}
                  height={48}
                  className="h-10 w-auto"
                />
                <div>
                  <div className="font-semibold text-white">Poultrigo</div>
                  <div className="text-xs text-orange-100">Operator Kandang</div>
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
              { id: "overview", label: "Beranda", icon: Gauge },
              { id: "kandang", label: "Kelola Kandang", icon: Home },
              { id: "daily", label: "Data Harian", icon: Calendar },
              { id: "reports", label: "Laporan", icon: BarChart3 },
              { id: "devices", label: "Perangkat", icon: Cpu },
              { id: "prediction", label: "Prediksi Pakan", icon: Calculator },
              { id: "news", label: "Berita", icon: Newspaper, route: "/news" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if ("route" in tab && tab.route) {
                    router.push(tab.route);
                  } else {
                    setActiveTab(tab.id as typeof activeTab);
                    setSidebarOpen(false);
                  }
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

                </h1>
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
                {[
                  {
                    label: "Total Kandang",
                    value: kandangs.length.toString(),
                    icon: Home,
                    color: "bg-orange-500",
                    trend: "Aktif",
                  },
                  {
                    label: "Total Populasi",
                    value: kandangs.reduce((sum, k) => sum + k.population, 0).toLocaleString(),
                    icon: ChickensIcon,
                    color: "bg-blue-500",
                    trend: "+" + (kandangs.length > 0 ? kandangs.reduce((sum, k) => sum + k.population, 0) % 200 : 0),
                  },
                  {
                    label: "Rata-rata Usia",
                    value: kandangs.length > 0
                      ? `${Math.round(kandangs.reduce((sum, k) => sum + k.age, 0) / kandangs.length)} hari`
                      : "0 hari",
                    icon: Calendar,
                    color: "bg-green-500",
                    trend: "Normal",
                  },
                  {
                    label: "Status Sistem",
                    value: kandangs.filter((k) => k.status === "Optimal").length === kandangs.length
                      ? "Optimal"
                      : "Peringatan",
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
                        Pemantauan Sensor Real-Time
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
                          isAnimationActive={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="humidity"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#humidityGradient)"
                          name="Kelembaban (%)"
                          isAnimationActive={false}
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
                        <div className="text-sm">Tampilan Kandang Langsung</div>
                        <div className="text-lg">
                          Kandang A1 - Operasi Aktif
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
                          className={`rounded-lg border-l-4 p-3 ${alert.type === "warning"
                            ? "border-orange-500 bg-orange-50"
                            : "border-blue-500 bg-blue-50"
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle
                              className={`mt-0.5 h-4 w-4 ${alert.type === "warning"
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
                    <h3 className="mb-4 text-lg">Aksi Cepat</h3>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("daily");
                          handleOpenCreateDaily();
                        }}
                        className="flex w-full items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        <ClipboardList className="h-5 w-5" />
                        <span>Update Data Harian</span>
                        <ChevronRight className="ml-auto h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("kandang");
                          handleOpenCreateKandang();
                        }}
                        className="flex w-full items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Tambah Kandang</span>
                        <ChevronRight className="ml-auto h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("reports")}
                        className="flex w-full items-center gap-3 rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span>Lihat Laporan</span>
                        <ChevronRight className="ml-auto h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "kandang" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleOpenCreateKandang}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Tambah Kandang
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {kandangs.map((kandang) => (
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
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${kandang.status === "Optimal"
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
                        onClick={() => handleOpenViewKandang(kandang)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditKandang(kandang)}
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


          {activeTab === "daily" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleOpenCreateDaily}
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
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="divide-y divide-slate-200">
                  {filteredDailyRecords.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      Tidak ada catatan untuk tanggal ini
                    </div>
                  ) : (
                    filteredDailyRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-6 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${record.status === "Selesai"
                              ? "bg-green-100"
                              : record.status === "Terlewat"
                                ? "bg-red-100"
                                : "bg-orange-100"
                              }`}
                          >
                            <ClipboardList
                              className={`h-5 w-5 ${record.status === "Selesai"
                                ? "text-green-600"
                                : record.status === "Terlewat"
                                  ? "text-red-600"
                                  : "text-orange-600"
                                }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <div className="text-[#001B34]">{record.task}</div>
                                <div className="text-sm text-slate-600">
                                  {record.kandangName}
                                </div>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs ${record.status === "Selesai"
                                  ? "bg-green-100 text-green-700"
                                  : record.status === "Terlewat"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-orange-100 text-orange-700"
                                  }`}
                              >
                                {record.status}
                              </span>
                            </div>
                            <div className="mb-2 text-sm text-slate-500">
                              Waktu: {record.time}
                            </div>
                            {record.notes && (
                              <div className="text-sm text-slate-600">
                                Catatan: {record.notes}
                              </div>
                            )}
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditDaily(record)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                              >
                                <Edit className="mr-1 inline h-3 w-3" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDailyRecord(record.id)}
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="mr-1 inline h-3 w-3" />
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-6 text-lg text-[#001B34]">
                  Riwayat Aktivitas Kandang
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Waktu</th>
                        <th className="px-4 py-3 font-medium">Kandang</th>
                        <th className="px-4 py-3 font-medium">Aksi</th>
                        <th className="px-4 py-3 font-medium">Populasi</th>
                        <th className="px-4 py-3 font-medium">Usia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            Belum ada riwayat aktivitas
                          </td>
                        </tr>
                      ) : (
                        history.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">
                              {new Date(item.timestamp).toLocaleString("id-ID")}
                            </td>
                            <td className="px-4 py-3 font-medium text-[#001B34]">
                              {item.kandangName}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${item.action === "Created"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {item.action === "Created" ? "Dibuat" : "Diupdate"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.population.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.age} hari
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

          {activeTab === "devices" && (
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleOpenCreateDevice}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Tambah Perangkat
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                          {device.type === "Feeder" ? (
                            <Cpu className="h-6 w-6" />
                          ) : device.type === "Waterer" ? (
                            <Droplets className="h-6 w-6" />
                          ) : (
                            <Activity className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#001B34]">
                            {device.name}
                          </h3>
                          <p className="text-sm text-slate-500">{device.type}</p>
                        </div>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs ${device.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {device.status}
                      </div>
                    </div>

                    <div className="mb-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Lokasi</span>
                        <span className="font-medium text-[#001B34]">
                          {kandangs.find((k) => k.id === device.kandangId)?.name ||
                            "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Baterai</span>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-[#001B34]">
                            {device.batteryLevel}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Sinyal</span>
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-[#001B34]">Good</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleDeviceStatus(device)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${device.status === "Active"
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                      >
                        <Power className="mr-2 inline h-4 w-4" />
                        {device.status === "Active" ? "Matikan" : "Hidupkan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDevice(device.id)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prediction" && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#001B34]">
                    <Calculator className="h-5 w-5 text-orange-500" />
                    Kalkulator Pakan
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Pilih Kandang
                      </label>
                      <select
                        value={predictionForm.kandangId}
                        onChange={(e) => {
                          const k = kandangs.find(k => k.id === e.target.value);
                          if (k) {
                            setPredictionForm({
                              ...predictionForm,
                              kandangId: k.id,
                              population: k.population,
                              age: k.age
                            });
                          }
                        }}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                      >
                        <option value="">-- Pilih Kandang --</option>
                        {kandangs.map(k => (
                          <option key={k.id} value={k.id}>{k.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-600">
                          Umur (Hari)
                        </label>
                        <input
                          type="number"
                          value={predictionForm.age}
                          readOnly
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-600">
                          Jenis Kelamin
                        </label>
                        <select
                          value={predictionForm.gender}
                          onChange={(e) => setPredictionForm({ ...predictionForm, gender: e.target.value as any })}
                          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                        >
                          <option value="Jantan">Jantan</option>
                          <option value="Betina">Betina</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-600">
                          Populasi (Ekor)
                        </label>
                        <input
                          type="number"
                          value={predictionForm.population}
                          onChange={(e) => setPredictionForm({ ...predictionForm, population: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-600">
                          Pakan Kemarin (kg)
                        </label>
                        <input
                          type="number"
                          value={predictionForm.feedYesterday}
                          onChange={(e) => setPredictionForm({ ...predictionForm, feedYesterday: parseFloat(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Sisa Pakan (kg)
                      </label>
                      <input
                        type="number"
                        value={predictionForm.leftover}
                        onChange={(e) => setPredictionForm({ ...predictionForm, leftover: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCalculatePrediction}
                      className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      Hitung Prediksi
                    </button>
                  </div>
                </div>

                {/* Result Card */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-[#001B34]">
                      Hasil Prediksi
                    </h3>
                    {predictionResult !== null ? (
                      <div className="text-center">
                        <div className="mb-2 text-sm text-slate-500">
                          Kebutuhan Pakan Hari Ini
                        </div>
                        <div className="mb-4 text-5xl font-bold text-orange-500">
                          {predictionResult} <span className="text-xl text-slate-400">kg</span>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                          <p>
                            Rekomendasi: Berikan pakan secara bertahap (pagi & sore) untuk efisiensi maksimal.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center text-slate-400">
                        Belum ada data prediksi
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-white/10 p-2">
                        <Cpu className="h-6 w-6 text-orange-400" />
                      </div>
                      <div>
                        <div className="font-medium">Info Model AI</div>
                        <div className="text-xs text-slate-400">v1.0.2 (Random Forest)</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">
                      Model prediksi menggunakan data historis 30 hari terakhir dengan akurasi rata-rata 94%.
                      Faktor cuaca dan kelembaban juga diperhitungkan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between print:hidden">
                <h2 className="text-xl font-bold text-[#001B34]">Laporan & Arsip</h2>
                <button
                  onClick={handlePrintReport}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" />
                  Cetak / Export PDF
                </button>
              </div>

              {/* Prediction History Report */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-[#001B34]">
                    Riwayat Prediksi Pakan
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="rounded-l-lg px-4 py-3 font-medium">Tanggal</th>
                        <th className="px-4 py-3 font-medium">Kandang</th>
                        <th className="px-4 py-3 font-medium">Populasi</th>
                        <th className="px-4 py-3 font-medium">Sisa Pakan</th>
                        <th className="rounded-r-lg px-4 py-3 font-medium">Hasil Prediksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {predictions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            Belum ada data prediksi
                          </td>
                        </tr>
                      ) : (
                        predictions.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">
                              {new Date(p.date).toLocaleDateString("id-ID")}
                            </td>
                            <td className="px-4 py-3 font-medium text-[#001B34]">
                              {p.kandangName}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {p.inputs.population.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {p.inputs.leftover} kg
                            </td>
                            <td className="px-4 py-3 font-bold text-orange-600">
                              {p.result} kg
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kandang History Report */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-6 text-lg text-[#001B34]">
                  Riwayat Aktivitas Kandang
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Waktu</th>
                        <th className="px-4 py-3 font-medium">Kandang</th>
                        <th className="px-4 py-3 font-medium">Aksi</th>
                        <th className="px-4 py-3 font-medium">Populasi</th>
                        <th className="px-4 py-3 font-medium">Usia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            Belum ada riwayat aktivitas
                          </td>
                        </tr>
                      ) : (
                        history.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">
                              {new Date(item.timestamp).toLocaleString("id-ID")}
                            </td>
                            <td className="px-4 py-3 font-medium text-[#001B34]">
                              {item.kandangName}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${item.action === "Created"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {item.action === "Created" ? "Dibuat" : "Diupdate"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.population.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {item.age} hari
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
        </div>

        {/* Modal Kandang */}
        {(modalMode === "create-kandang" || modalMode === "edit-kandang" || modalMode === "view-kandang") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-[#001B34]">
                  {modalMode === "create-kandang"
                    ? "Tambah Kandang Baru"
                    : modalMode === "edit-kandang"
                      ? "Edit Kandang"
                      : "Detail Kandang"}
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
                {modalMode === "view-kandang" && selectedKandang ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        { label: "Nama Kandang", value: selectedKandang.name },
                        { label: "ID Kandang", value: selectedKandang.id },
                        { label: "Populasi", value: selectedKandang.population.toLocaleString() },
                        { label: "Usia", value: `${selectedKandang.age} hari` },
                        { label: "Status", value: selectedKandang.status },
                        { label: "Dibuat", value: new Date(selectedKandang.createdAt).toLocaleString("id-ID") },
                      ].map((item) => (
                        <div key={item.label}>
                          <label className="mb-2 block text-sm text-slate-600">
                            {item.label}
                          </label>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#001B34]">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => selectedKandang && handleOpenEditKandang(selectedKandang)}
                        className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white transition-all hover:shadow-lg"
                      >
                        Edit Kandang
                      </button>
                      <button
                        type="button"
                        onClick={() => selectedKandang && handleDeleteKandang(selectedKandang.id)}
                        className="flex-1 rounded-lg border border-red-500 bg-white px-4 py-2.5 text-red-600 transition-all hover:bg-red-50"
                      >
                        Hapus Kandang
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveKandang();
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
                        Nama Kandang <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={kandangFormData.name}
                        onChange={(e) =>
                          setKandangFormData({ ...kandangFormData, name: e.target.value })
                        }
                        placeholder="Contoh: Kandang A1"
                        className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-slate-600">
                          Populasi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={kandangFormData.population || ""}
                          onChange={(e) =>
                            setKandangFormData({ ...kandangFormData, population: parseInt(e.target.value) || 0 })
                          }
                          className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-slate-600">
                          Usia (hari) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={kandangFormData.age || ""}
                          onChange={(e) =>
                            setKandangFormData({ ...kandangFormData, age: parseInt(e.target.value) || 0 })
                          }
                          className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>



                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={kandangFormData.status}
                        onChange={(e) =>
                          setKandangFormData({
                            ...kandangFormData,
                            status: e.target.value as "Optimal" | "Peringatan" | "Kritis",
                          })
                        }
                        className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                      >
                        <option value="Optimal">Optimal</option>
                        <option value="Peringatan">Peringatan</option>
                        <option value="Kritis">Kritis</option>
                      </select>
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
                        {modalMode === "create-kandang" ? "Tambah Kandang" : "Simpan Perubahan"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Modal Daily Record */}
        {(modalMode === "create-daily" || modalMode === "edit-daily") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-[#001B34]">
                  {modalMode === "create-daily" ? "Tambah Catatan Harian" : "Edit Catatan Harian"}
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveDailyRecord();
                  }}
                  className="space-y-4"
                >
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Tanggal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={recordFormData.date}
                        onChange={(e) =>
                          setRecordFormData({ ...recordFormData, date: e.target.value })
                        }
                        className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Waktu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        required
                        value={recordFormData.time}
                        onChange={(e) =>
                          setRecordFormData({ ...recordFormData, time: e.target.value })
                        }
                        className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Kandang <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={recordFormData.kandangId}
                      onChange={(e) => {
                        const kandang = kandangs.find((k) => k.id === e.target.value);
                        setRecordFormData({
                          ...recordFormData,
                          kandangId: e.target.value,
                          kandangName: kandang?.name || "",
                        });
                      }}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">Pilih Kandang</option>
                      {kandangs.map((kandang) => (
                        <option key={kandang.id} value={kandang.id}>
                          {kandang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Nama Tugas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recordFormData.task}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, task: e.target.value })
                      }
                      placeholder="Contoh: Pemberian pakan pagi"
                      className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={recordFormData.status}
                      onChange={(e) =>
                        setRecordFormData({
                          ...recordFormData,
                          status: e.target.value as "Selesai" | "Menunggu" | "Terlewat",
                        })
                      }
                      className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Terlewat">Terlewat</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Catatan
                    </label>
                    <textarea
                      value={recordFormData.notes}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, notes: e.target.value })
                      }
                      placeholder="Tambahkan catatan tambahan (opsional)"
                      rows={3}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 px-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
                    />
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
                      {modalMode === "create-daily" ? "Tambah Catatan" : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Create Device Modal */}
        {modalMode === "create-device" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-[#001B34]">
                Tambah Perangkat Baru
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nama Perangkat
                  </label>
                  <input
                    type="text"
                    value={deviceFormData.name}
                    onChange={(e) =>
                      setDeviceFormData({ ...deviceFormData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="Contoh: Robot Pakan A1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Tipe Perangkat
                  </label>
                  <select
                    value={deviceFormData.type}
                    onChange={(e) =>
                      setDeviceFormData({
                        ...deviceFormData,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Feeder">Feeder (Pakan)</option>
                    <option value="Waterer">Waterer (Minum)</option>
                    <option value="Cleaner">Cleaner (Pembersih)</option>
                    <option value="Sensor">Sensor</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Lokasi Kandang
                  </label>
                  <select
                    value={deviceFormData.kandangId}
                    onChange={(e) =>
                      setDeviceFormData({ ...deviceFormData, kandangId: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    {kandangs.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleCloseModal}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveDevice}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default OperatorDashboard;
