"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Check,
  Sparkles,
  Gauge,
  Shield,
  Menu,
  X,

  Calendar,
  Eye,
  Tag,
  ChevronDown,
} from "lucide-react";
import ImageWithFallback from "@/components/shared/image-with-fallback";


const featureCards = [
  {
    title: "Pemantauan Sensor Real-time",
    category: "IoT",
    description:
      "Pantau suhu, kelembapan, amonia, dan kondisi pakan di seluruh kandang secara langsung.",
  },
  {
    title: "Notifikasi Cerdas",
    category: "Alert",
    description:
      "Terima peringatan otomatis saat kondisi kandang melebihi ambang aman via email atau aplikasi.",
  },
  {
    title: "Manajemen Kandang",
    category: "Management",
    description:
      "Kelola banyak kandang lengkap dengan populasi ayam, umur, status kesehatan, dan jadwal pakan.",
  },
  {
    title: "Statistik Pertumbuhan",
    category: "Analytics",
    description:
      "Analisis kenaikan berat ayam, mortalitas, dan efisiensi pakan dengan grafik interaktif.",
  },
  {
    title: "Dashboard Berbasis Data",
    category: "Dashboard",
    description:
      "Visualisasikan seluruh data peternakan di dalam dashboard intuitif untuk keputusan cepat.",
  },
  {
    title: "Analitik Produksi",
    category: "ML",
    description:
      "Optimalkan biaya dan ROI melalui analisis produksi yang terperinci.",
  },
  {
    title: "Prediksi Machine Learning",
    category: "AI",
    description:
      "Prediksi kebutuhan pakan, waktu pemberian optimal, dan potensi penyakit lebih dini.",
  },
  {
    title: "Integrasi Perangkat IoT",
    category: "Integration",
    description:
      "Hubungkan sensor Poultrigo, otomatisasi pakan, dan perangkat monitoring ke satu platform.",
  },
  {
    title: "Penjadwalan Otomatis",
    category: "Automation",
    description:
      "Atur jadwal pakan, kebersihan, dan pemeliharaan dengan pengingat otomatis.",
  },
];

const whyCards = [
  {
    title: "Keputusan berbasis data",
    desc: "Manfaatkan data realtime yang diperkaya AI untuk setiap langkah.",
    metric: "95%",
    caption: "Keputusan lebih akurat",
    icon: Activity,
  },
  {
    title: "Hemat waktu & biaya",
    desc: "Otomasi rutinitas, kurangi kerja manual, dan tekan biaya operasional.",
    metric: "30%",
    caption: "Penghematan biaya",
    icon: Sparkles,
  },
  {
    title: "Integrasi IoT penuh",
    desc: "Hubungkan sensor, feeder otomatis, dan perangkat monitoring tanpa ribet.",
    metric: "100+",
    caption: "Perangkat terintegrasi",
    icon: Gauge,
  },
  {
    title: "Solusi skalabel",
    desc: "Dari satu kandang hingga ratusan lokasi, sistem tumbuh bersama bisnis Anda.",
    metric: "∞",
    caption: "Skala tanpa batas",
    icon: Shield,
  },
  {
    title: "Analitik ML",
    desc: "Prediksi kebutuhan pakan & kesehatan ayam secara proaktif 24/7.",
    metric: "24/7",
    caption: "Pengawasan AI",
    icon: Sparkles,
  },
  {
    title: "Keamanan tepercaya",
    desc: "Keamanan enterprise dengan SLA ketersediaan 99,9%.",
    metric: "99.9%",
    caption: "Uptime SLA",
    icon: Shield,
  },
];

const roleCards = [
  {
    title: "Guest / Pembeli",
    badge: "Public Access",
    items: [
      "Akses informasi produk dan harga",
      "Melihat fitur dan manfaat",
      "Mendaftar akun baru",
      "Menghubungi tim dukungan",
    ],
    cta: "Pelajari",
  },
  {
    title: "Operator Kandang",
    badge: "Farm Operations",
    highlight: true,
    items: [
      "Pantau seluruh kandang ayam",
      "Perbarui data harian lapangan",
      "Cek sensor realtime",
      "Kelola populasi ayam",
      "Lihat laporan & analitik",
      "Terima alert & notifikasi",
    ],
    cta: "Mulai Sekarang",
  },
  {
    title: "Admin Developer",
    badge: "Full Control",
    items: [
      "Akses penuh konfigurasi sistem",
      "Manajemen pengguna",
      "Pengaturan sensor dan perangkat",
      "Melihat log sistem & API",
      "Integrasi dengan aplikasi lain",
    ],
    cta: "Pelajari",
  },
];

const partnerLogos = [
  {
    name: "PT. Japfa",
    logo: "Logo/Japfa_logo.svg",
  },
  {
    name: "Tekom",
    logo: "Logo/Logo TEKOM.png",
  },
  {
    name: "Sekolah Vokasi",
    logo: "Logo/Logo Sekolah Vokasi.png",
  },
];

const navLinks = [
  { label: "Fitur", target: "fitur" },
  { label: "Cara Kerja", target: "cara-kerja" },
  { label: "Implementasi Robot", target: "robotik" },
  { label: "Kenapa Kami", target: "kenapa-kami" },
  { label: "Peran", target: "peran" },
];

const roboticsHighlights = [
  "Chick Bot memasok pakan berdasarkan rekomendasi ML secara presisi hingga gram terakhir.",
  "Sensor load-cell memvalidasi keberhasilan distribusi dan mengirim telemetri ke dashboard Poultrigo.",
  "Routine cleaning & refill otomatis sehingga operator hanya fokus pada analitik.",
  "Video animasi & model 3D siap dipresentasikan ke investor maupun mitra teknologi.",
];

export function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [mobileAuthOpen, setMobileAuthOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    import("@google/model-viewer")
      .then(() => setModelViewerReady(true))
      .catch(() => setModelViewerReady(false));
  }, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setAuthMenuOpen(false);
    setMobileAuthOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      closeMenus();
    }
  };

  const goTo = (path: string) => {
    closeMenus();
    router.push(path);
  };

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${scrolled
          ? "border-slate-200 bg-white shadow-sm"
          : "border-slate-200/50 bg-white/95 backdrop-blur-md"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center">
            <Image
              src="/Logo/Logo Poultrigo_Primary.svg"
              alt="Poultrigo"
              width={180}
              height={72}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex lg:gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.target)}
                className="transition-colors hover:text-orange-500"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => goTo("/news")}
              className="transition-colors hover:text-orange-500"
            >
              Berita
            </button>
            <div className="relative" ref={authMenuRef}>
              <button
                type="button"
                onClick={() => setAuthMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 font-medium text-[#001B34] transition-colors hover:border-orange-400 hover:text-orange-500"
                aria-expanded={authMenuOpen}
              >
                Akses Akun
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${authMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {authMenuOpen && (
                <div className="absolute right-0 z-50 mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-xl">
                  <button
                    type="button"
                    onClick={() => goTo("/login")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[#001B34] transition-colors hover:bg-slate-50 hover:text-orange-500"
                  >
                    Masuk
                    <ArrowRight className="h-3.5 w-3.5 text-orange-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("/register")}
                    className="mt-2 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 text-left font-semibold text-white shadow-md transition-all hover:shadow-lg"
                  >
                    Daftar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.target)}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-orange-500"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => goTo("/news")}
                className="block w-full rounded-lg px-4 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-orange-500"
              >
                Berita
              </button>
              <div className="rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMobileAuthOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-500"
                  aria-expanded={mobileAuthOpen}
                >
                  Akses Akun
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileAuthOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileAuthOpen && (
                  <div className="space-y-2 px-4 pb-3 pt-1">
                    <button
                      type="button"
                      onClick={() => goTo("/login")}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-orange-500"
                    >
                      Masuk
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo("/register")}
                      className="block w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 text-left text-sm font-semibold text-white shadow-md"
                    >
                      Daftar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001B34] via-[#052348] to-[#001B34] px-4 py-12 text-white sm:px-6 sm:py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-orange-500 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-orange-400 blur-3xl" style={{ animationDelay: "1s" }} />
          </div>
          <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in-up">
              {/* Logo with Tagline */}
              <div className="mb-4 sm:mb-6 flex flex-col gap-2">
                <Image
                  src="/Logo/Logo Poultrigo_Tagline.svg"
                  alt="Poultrigo Tagline"
                  width={280}
                  height={120}
                  className="h-auto w-56 sm:w-64 lg:w-72"
                  priority
                />
              </div>
              <div className="inline-flex items-center gap-2 border-b-2 border-orange-500 pb-1 text-xs font-medium text-orange-400 sm:text-sm">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                Platform IoT + Machine Learning
              </div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Poultrigo – Platform IoT & ML Pintar untuk Peternakan Ayam
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                Transformasikan peternakan Anda dengan pemantauan real-time, otomasi pakan,
                dan analitik AI. Tingkatkan efisiensi, kurangi biaya, dan optimalkan
                kesehatan ayam.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => router.push("/register")}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:px-6 sm:py-3 sm:rounded-2xl"
                >
                  Mulai Sekarang
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-white/80 sm:gap-6 sm:text-sm">
                {["Pemantauan realtime", "Analitik AI", "Dukungan 24/7"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {/* Decorative gradient overlay */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-purple-500/20 blur-2xl opacity-50 animate-pulse" style={{ animationDuration: "3s" }} />

              {/* Main image container with enhanced styling */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:border-white/30 hover:shadow-orange-500/20 sm:rounded-[2rem] sm:p-3">
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1697545698404-46828377ae9d?auto=format&fit=crop&w=1400&q=90"
                    alt="Peternakan modern dengan teknologi IoT"
                    className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-110 sm:h-[500px] lg:h-[600px]"
                  />

                  {/* Gradient overlay untuk depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001B34]/40 via-transparent to-transparent" />

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-orange-400/60 animate-float" style={{ animationDelay: "0s", animationDuration: "3s" }} />
                    <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-orange-400/60 animate-float" style={{ animationDelay: "1s", animationDuration: "4s" }} />
                    <div className="absolute bottom-1/4 left-1/3 h-2 w-2 rounded-full bg-orange-300/60 animate-float" style={{ animationDelay: "2s", animationDuration: "3.5s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="fitur" className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
                <span className="h-0.5 w-8 bg-orange-600"></span>
                Tentang Poultrigo
              </div>
              <h2 className="text-2xl font-semibold text-[#001B34] sm:text-3xl">
                Masa Depan Manajemen Peternakan Ayam
              </h2>
              <p className="text-sm text-slate-600 sm:text-base">
                Poultrigo adalah platform IoT dan Machine Learning yang dirancang untuk
                peternakan ayam modern. Kami menyediakan alat komprehensif, dashboard
                cerdas, dan sistem pemantauan real-time untuk memudahkan transisi ke operasi
                digital.
              </p>
              <p className="text-sm text-slate-600 sm:text-base">
                Dengan sensor terbaru dan analitik AI, Anda dapat meningkatkan kesehatan
                ayam, efisiensi pakan, menekan biaya, dan memaksimalkan produktivitas
                peternakan.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {[
                  { title: "Platform IoT", desc: "Pemrosesan data berbasis cloud" },
                  { title: "Dashboard Pintar", desc: "Insight realtime yang jelas" },
                  { title: "Machine Learning", desc: "Analisis prediktif otomatis" },
                  { title: "Alert Sistem", desc: "Notifikasi cepat & responsif" },
                ].map((item, idx) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md sm:rounded-2xl sm:p-4 animate-scale-in"
                    style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                  >
                    <p className="font-semibold text-[#001B34] sm:text-sm">{item.title}</p>
                    <p className="text-xs text-slate-600 sm:text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#001B34] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg sm:rounded-2xl sm:px-5 sm:py-3"
              >
                Pelajari Selengkapnya
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1694854038360-56b29a16fb0c?auto=format&fit=crop&w=1200&q=80"
                alt="Kandang ayam modern"
                className="h-full rounded-2xl object-cover sm:rounded-3xl"
              />
              <div className="absolute -bottom-4 left-4 rounded-xl bg-white p-3 shadow-xl sm:-bottom-6 sm:left-6 sm:rounded-2xl sm:p-4">
                <p className="text-xs text-slate-500 sm:text-sm">Kenaikan efisiensi rata-rata</p>
                <p className="text-2xl font-semibold text-[#001B34] sm:text-3xl">+35%</p>
                <p className="text-[10px] text-slate-500 sm:text-xs">Peternakan pengguna Poultrigo</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="cara-kerja" className="bg-slate-100 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
              <span className="h-0.5 w-8 bg-orange-600"></span>
              Cara Kerja
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#001B34] sm:mt-4 sm:text-3xl">
              Sistem sederhana namun kuat
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Solusi end-to-end yang menghubungkan kandang dengan cloud
            </p>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Sensor IoT",
                  desc: "Perangkat Poultrigo mengukur pakan, menimbang pakan yang telah ada, memprediksi pakan, dan memberikan pakan sesuai dengan prediksi.",
                  img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
                },
                {
                  step: "02",
                  title: "Data Ke Cloud",
                  desc: "Data dikirim otomatis ke Poultrigo Cloud untuk disimpan dan diproses.",
                  img: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=800&q=80",
                },
                {
                  step: "03",
                  title: "Analisis ML",
                  desc: "Model machine learning memprediksi kebutuhan pakan sesuai dengan kategori ayam.",
                  img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
                },
                {
                  step: "04",
                  title: "Dashboard Pintar",
                  desc: "Admin dan operator melihat rekomendasi dan status di dashboard.",
                  img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
                },
              ].map((card, idx) => (
                <div
                  key={card.step}
                  className="group rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-5 animate-scale-in"
                  style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <Image
                    src={card.img}
                    alt={card.title}
                    width={400}
                    height={260}
                    className="h-40 w-full rounded-xl object-cover transition-transform group-hover:scale-105 sm:h-48 sm:rounded-2xl"
                    priority={card.step === "01"}
                  />
                  <div className="mt-3 flex flex-col items-center gap-2 text-center sm:mt-4">
                    <div className="flex items-center gap-2 text-xs text-orange-600 sm:text-sm">
                      <span className="font-semibold">{card.step}</span>
                      <span className="font-semibold text-[#001B34] sm:text-base">{card.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Robotics Implementation */}
        <section
          id="robotik"
          className="bg-gradient-to-br from-[#010f1f] via-[#021a30] to-[#010f1f] px-4 py-12 text-white sm:px-6 sm:py-16"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-300 sm:text-sm">
                <span className="h-0.5 w-8 bg-orange-400"></span>
                Implementasi Robotik Chick Bot
              </div>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Robot feeder otomatis siap mendemonstrasikan alur pemberian pakan cerdas
              </h3>
              <p className="text-sm text-white/80 sm:text-base">
                Panel ini menampilkan integrasi video proses robotik serta model 3D yang sama
                dengan unit fisik di lapangan. Gunakan aset berikut untuk presentasi, demo investor,
                atau uji coba langsung di kandang percontohan.
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                {roboticsHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 flex-shrink-0 text-green-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2 sm:gap-4">
                <a
                  href="/3d/CHICKEN FEEDING PLACE.f3d"
                  download
                  className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:bg-white/10 sm:px-5 sm:py-2.5"
                >
                  Unduh Model .f3d
                </a>
                <a
                  href="/3d/CHICKEN FEEDING PLACE.glb"
                  download
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-orange-400 sm:px-5 sm:py-2.5"
                >
                  Unduh Model .glb
                </a>
              </div>
              <p className="text-xs text-white/60 sm:text-sm">
                Format .f3d cocok untuk CAD internal, sementara .glb digunakan untuk viewer 3D web ini.
              </p>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-2xl">
                  <video
                    controls
                    playsInline
                    poster="/Logo/Logo Poultrigo_Navy_Primary.svg"
                    className="h-60 w-full rounded-2xl object-cover sm:h-72"
                    src="/Video/Animasi Robotik Chick Bot.mp4"
                  >
                    Browser Anda tidak mendukung video bawaan.
                  </video>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60 sm:text-sm">
                  <Tag className="h-4 w-4 text-orange-300" />
                  Animasi Robotik Chick Bot
                </p>
              </div>
              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-2xl bg-[#031226]">
                  {modelViewerReady ? (
                    // @ts-ignore
                    <model-viewer
                      src="/3d/CHICKEN FEEDING PLACE.glb"
                      className="h-[320px] w-full"
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      exposure="0.9"
                      interaction-prompt="none"
                      autoplay
                    />
                  ) : (
                    <div className="flex h-[320px] w-full items-center justify-center text-sm text-white/70">
                      Menyiapkan pratinjau 3D...
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
                  <div>
                    <p className="text-base font-semibold text-white">Pratinjau 3D Feeding Place</p>
                    <p>Tekan drag untuk memutar & zoom.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:border-orange-400 hover:bg-white/10"
                  >
                    Minta Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="kenapa-kami" className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
              <span className="h-0.5 w-8 bg-orange-600"></span>
              Fitur Inti
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#001B34] sm:mt-4 sm:text-3xl">
              Semua yang Anda butuhkan dalam satu platform
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Alat lengkap untuk manajemen peternakan ayam modern
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featureCards.map((feature, idx) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:rounded-3xl sm:p-5 animate-scale-in"
                style={{ animationDelay: `${0.05 + idx * 0.05}s` }}
              >
                <div className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-500 sm:mb-3 sm:px-3 sm:text-xs">
                  {feature.category}
                </div>
                <p className="text-base font-semibold text-[#001B34] sm:text-lg">
                  {feature.title}
                </p>
                <p className="mt-1.5 text-xs text-slate-600 sm:mt-2 sm:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why choose */}
        <section className="bg-slate-100 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
              <span className="h-0.5 w-8 bg-orange-600"></span>
              Mengapa Poultrigo
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#001B34] sm:mt-4 sm:text-3xl">
              Dibangun untuk peternak modern
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Ratusan peternak telah bertransformasi bersama Poultrigo
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
            {whyCards.map((card, idx) => (
              <div
                key={card.title}
                className="group rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md sm:rounded-3xl sm:p-6 animate-scale-in"
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 text-[#001B34] transition-transform group-hover:scale-110 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="text-base font-semibold text-[#001B34] sm:text-lg">{card.title}</p>
                <p className="mt-1 text-xs text-slate-600 sm:mt-2 sm:text-sm">{card.desc}</p>
                <div className="mt-3 border-t border-slate-100 pt-3 text-[#001B34] sm:mt-4">
                  <p className="text-2xl font-semibold sm:text-3xl">{card.metric}</p>
                  <p className="text-[10px] text-slate-500 sm:text-xs">{card.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="peran" className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
              <span className="h-0.5 w-8 bg-orange-600"></span>
              Roles & Access
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#001B34] sm:mt-4 sm:text-3xl">
              Pembagian peran dalam sistem Poultrigo
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Setiap peran memiliki tanggung jawab dan hak akses berbeda
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-7xl space-y-6 sm:mt-10 sm:space-y-8">
            {roleCards.map((role, idx) => (
              <div
                key={role.title}
                className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:shadow-md sm:rounded-2xl sm:px-6 sm:py-5 animate-scale-in"
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                  <div>
                    <p className="text-xl font-semibold text-[#001B34] sm:text-2xl">
                      {role.title}
                    </p>
                    <p className="text-xs text-slate-500 sm:text-sm">{role.badge}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:gap-6 sm:text-sm lg:gap-8">
                    <ul className="flex-1 space-y-1.5 sm:space-y-2">
                      {role.items.slice(0, Math.ceil(role.items.length / 2)).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500 sm:h-4 sm:w-4" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="flex-1 space-y-1.5 sm:space-y-2">
                      {role.items.slice(Math.ceil(role.items.length / 2)).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500 sm:h-4 sm:w-4" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mitra Kami */}
        <section id="mitra" className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
              <span className="h-0.5 w-8 bg-orange-600"></span>
              Mitra Kami
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-[#001B34] sm:mt-4 sm:text-3xl">
              Dipercaya oleh integrator dan produsen pakan besar
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Berikut beberapa mitra yang menggunakan Poultrigo untuk mengoptimalkan
              operasi peternakan ayam mereka.
            </p>
          </div>
          <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-center gap-6 sm:mt-10 sm:gap-10 animate-fade-in">
            {partnerLogos.map((partner, index) => (
              <div
                key={partner.name}
                className="flex items-center justify-center opacity-90 transition-all hover:scale-110 hover:opacity-100"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={60}
                  className="h-10 w-auto object-contain sm:max-h-12"
                />
              </div>
            ))}
          </div>
        </section>



        {/* Tim Pengembang */}
        <section id="tim" className="bg-slate-100 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 sm:text-sm">
                <span className="h-0.5 w-8 bg-orange-600"></span>
                Tim Pengembang
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-[#001B34] sm:mt-4 sm:text-3xl">
                Tim di Balik Poultrigo
              </h3>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Tim profesional yang berdedikasi untuk menghadirkan solusi terbaik bagi peternakan modern
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {/* Muhammad Rizki */}
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up sm:p-8" style={{ animationDelay: "0.1s" }}>
                <div className="relative mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-orange-200 shadow-lg transition-all group-hover:border-orange-400 group-hover:scale-105 sm:h-40 sm:w-40">
                    <ImageWithFallback
                      src="/Team/Muhammad_Rizki.jpg"
                      alt="Muhammad Rizki"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="mb-1 text-lg font-bold text-[#001B34] sm:text-xl">Muhammad Rizki</h4>
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <span className="border-b border-orange-500 px-1 pb-0.5 font-medium text-[#001B34]">Project Manager</span>
                    <span className="border-b border-[#001B34] px-1 pb-0.5 font-medium text-[#001B34]">System Architect</span>
                    <span className="border-b border-orange-500 px-1 pb-0.5 font-medium text-[#001B34]">Database Designer</span>
                    <span className="border-b border-[#001B34] px-1 pb-0.5 font-medium text-[#001B34]">Backend Developer</span>
                  </div>
                </div>
              </div>

              {/* Ghina Rania */}
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up sm:p-8" style={{ animationDelay: "0.2s" }}>
                <div className="relative mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-orange-200 shadow-lg transition-all group-hover:border-orange-400 group-hover:scale-105 sm:h-40 sm:w-40">
                    <ImageWithFallback
                      src="/Team/Ghina_Rania.png"
                      alt="Ghina Rania"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="mb-1 text-lg font-bold text-[#001B34] sm:text-xl">Ghina Rania</h4>
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <span className="border-b border-orange-500 px-1 pb-0.5 font-medium text-[#001B34]">Quality Assurance</span>
                    <span className="border-b border-[#001B34] px-1 pb-0.5 font-medium text-[#001B34]">UI/UX Designer</span>
                    <span className="border-b border-orange-500 px-1 pb-0.5 font-medium text-[#001B34]">Frontend Developer</span>
                  </div>
                </div>
              </div>

              {/* Fatimah Azzahidah */}
              <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up sm:p-8 sm:col-span-2 lg:col-span-1" style={{ animationDelay: "0.3s" }}>
                <div className="relative mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-orange-200 shadow-lg transition-all group-hover:border-orange-400 group-hover:scale-105 sm:h-40 sm:w-40">
                    <ImageWithFallback
                      src="/Team/Fatimah_Az_Zahidah.png"
                      alt="Fatimah Azzahidah"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="mb-1 text-lg font-bold text-[#001B34] sm:text-xl">Fatimah Azzahidah</h4>
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <span className="border-b border-orange-500 px-1 pb-0.5 font-medium text-[#001B34]">Project Assistant</span>
                    <span className="border-b border-[#001B34] px-1 pb-0.5 font-medium text-[#001B34]">Documentation Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#001B34] to-[#032247] px-4 py-12 text-white sm:px-6 sm:py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center animate-fade-in-up">
            <h3 className="text-2xl font-semibold sm:text-3xl">
              Siap mengubah peternakan ayam Anda?
            </h3>
            <p className="text-sm text-white/80 sm:text-base">
              Bergabung bersama peternak yang mengoptimalkan operasional mereka dengan
              Poultrigo.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push("/register")}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:rounded-2xl sm:px-6 sm:py-3"
              >
                Mulai Sekarang
              </button>
              <button
                onClick={() => router.push("/login")}
                className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:rounded-2xl sm:px-6 sm:py-3"
              >
                Masuk
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#001B34] px-4 py-8 text-xs text-white/80 sm:px-6 sm:py-12 sm:text-sm">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 md:grid-cols-4 sm:gap-8">
          <div>
            <div className="mb-3 sm:mb-4">
              <Image
                src="/Logo/Logo Poultrigo_Primary.svg"
                alt="Poultrigo"
                width={180}
                height={72}
                className="h-auto w-36 sm:w-40"
              />
            </div>
            <p className="text-xs leading-relaxed sm:text-sm">
              Transformasikan peternakan Anda dengan teknologi IoT dan machine learning
              dari Poultrigo.
            </p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white sm:mb-3 sm:text-sm">Produk</p>
            <ul className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
              <li className="cursor-pointer hover:text-white transition-colors">Fitur</li>
              <li className="cursor-pointer hover:text-white transition-colors">Cara Kerja</li>
              <li className="cursor-pointer hover:text-white transition-colors">Demo</li>
              <li className="cursor-pointer hover:text-white transition-colors">Harga</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white sm:mb-3 sm:text-sm">Perusahaan</p>
            <ul className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
              <li className="cursor-pointer hover:text-white transition-colors">Tentang Kami</li>
              <li className="cursor-pointer hover:text-white transition-colors">Blog</li>
              <li className="cursor-pointer hover:text-white transition-colors">Karier</li>
              <li className="cursor-pointer hover:text-white transition-colors">Kontak</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white sm:mb-3 sm:text-sm">Kontak</p>
            <p className="text-xs sm:text-sm">Email: infopoultrigo@gmail.com</p>
            <p className="text-xs sm:text-sm">Telepon: +62 853 8937 1126</p>
            <p className="text-xs sm:text-sm">Bogor, Indonesia</p>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-[10px] text-white/60 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <p>&copy; {new Date().getFullYear()} Poultrigo. Semua hak dilindungi.</p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Cookie</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
