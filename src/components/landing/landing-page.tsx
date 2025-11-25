"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Shield,
  Gauge,
  Eye,
  Users,
  CheckCircle2,
} from "lucide-react";
import ImageWithFallback from "@/components/shared/image-with-fallback";

const roles = [
  {
    label: "Admin Developer",
    description:
      "Mengatur seluruh konfigurasi sistem, hak akses, dan integrasi sensor IoT agar platform berjalan stabil.",
    highlights: [
      "Kontrol penuh pengaturan aplikasi",
      "Monitoring log sistem dan API",
      "Pengelolaan pengguna lintas peran",
    ],
    icon: Shield,
    cta: "/admin",
    accent: "from-[#001B34] to-[#003561]",
  },
  {
    label: "Operator Kandang",
    description:
      "Memantau kondisi kandang, memperbarui data harian, serta memastikan sensor dan perangkat lapangan dalam keadaan optimal.",
    highlights: [
      "Pantauan sensor real-time",
      "Catatan aktivitas kandang",
      "Laporan performa populasi",
    ],
    icon: Gauge,
    cta: "/operator",
    accent: "from-orange-500 to-orange-600",
  },
  {
    label: "Guest / Pembeli",
    description:
      "Akses ringkas untuk melihat produk ayam, status pesanan, dan transparansi kualitas peternakan digital Poultrigo.",
    highlights: [
      "Informasi ketersediaan produk",
      "Riwayat dan status pesanan",
      "Transparansi data peternakan",
    ],
    icon: Eye,
    cta: "/guest",
    accent: "from-slate-500 to-slate-600",
  },
];

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-base text-[#0f172a]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#001B34] to-[#003e73] text-white shadow-lg">
              <Activity className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-lg font-semibold">Poultrigo</p>
              <p className="text-xs text-slate-500">
                Platform Performa Peternakan Ayam
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-slate-600 transition-colors hover:text-[#001B34]"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/40"
            >
              Daftar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-[#001B34] via-[#0b2d55] to-[#001B34] px-6 py-20 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">
            <div className="w-full space-y-6 lg:w-1/2">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-orange-300">
                <Users className="h-4 w-4" />
                Tiga peran inti, satu platform terpadu
              </p>
              <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Pantau, kelola, dan kolaborasikan peternakan ayam modern dalam satu
                sistem.
              </h1>
              <p className="text-lg text-slate-200">
                Poultrigo memisahkan pengalaman Admin, Operator, dan Guest agar setiap
                peran fokus pada keputusan penting—mulai dari konfigurasi IoT, operasional
                kandang, hingga transparansi kepada pembeli.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-medium text-white transition-all hover:shadow-2xl hover:shadow-orange-500/30"
                >
                  Mulai Digitalisasi
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="rounded-xl border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Lihat Demo Peran
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/5 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1697545698404-46828377ae9d?auto=format&fit=crop&w=1200&q=80"
                  alt="Dashboard Poultrigo"
                  className="h-72 w-full object-cover"
                />
                <div className="space-y-4 px-6 py-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
                    Penyelarasan Peran
                  </p>
                  <div className="grid gap-4 text-sm text-slate-200 md:grid-cols-3">
                    {[
                      { title: "Admin", desc: "Atur sensor dan akses" },
                      { title: "Operator", desc: "Catat data kandang" },
                      { title: "Guest", desc: "Pantau stok & pesanan" },
                    ].map((info) => (
                      <div key={info.title} className="rounded-xl border border-white/10 p-3">
                        <p className="font-semibold text-white">{info.title}</p>
                        <p>{info.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-semibold text-[#001B34]">
              Tiga pengalaman berbeda untuk satu tujuan yang sama.
            </h2>
            <p className="mt-4 text-slate-600">
              Setiap peran memiliki dashboard khusus agar komunikasi data antar tim lebih
              jelas dan keputusan bisa diambil lebih cepat.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.label}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} text-white`}
                >
                  <role.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-[#001B34]">
                  {role.label}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{role.description}</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {role.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => router.push(role.cta)}
                  className="mt-auto w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-[#001B34] transition hover:bg-slate-200"
                >
                  Buka Tampilan
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
            <div className="w-full space-y-4 lg:w-1/2">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                Kenapa tetap satu platform?
              </p>
              <h3 className="text-3xl font-semibold text-[#001B34]">
                Data yang sama dapat dibaca dengan konteks berbeda oleh setiap peran.
              </h3>
              <p className="text-slate-600">
                Admin fokus pada konfigurasi dan keamanan, Operator memantau rutinitas
                kandang, sedangkan Guest melihat transparansi pasokan. Semua berbagi dasar
                data yang sama sehingga keputusan lebih cepat dan akurat.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Bahasa yang sama",
                    body: "Istilah dan status sistem disesuaikan dengan kebutuhan lokal peternakan.",
                  },
                  {
                    title: "Data konsisten",
                    body: "Tidak ada duplikasi entri. Perbedaan hanya pada level akses.",
                  },
                  {
                    title: "Kolaborasi cepat",
                    body: "Peringatan sensor langsung diteruskan ke peran yang tepat.",
                  },
                  {
                    title: "Transparan untuk pembeli",
                    body: "Guest cukup melihat ringkasan tanpa mengganggu pekerjaan operator.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-base font-semibold text-[#001B34]">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 lg:w-1/2">
              <h4 className="text-xl font-semibold text-[#001B34]">
                Ringkasan alur kerja antar peran
              </h4>
              <div className="mt-6 space-y-5 text-sm text-slate-600">
                {[
                  {
                    step: "1",
                    title: "Admin menambahkan perangkat baru",
                    desc: "Sensor IoT otomatis terdaftar dan siap dipantau.",
                  },
                  {
                    step: "2",
                    title: "Operator memantau data lapangan",
                    desc: "Jika ada anomali, tugas harian langsung diperbarui.",
                  },
                  {
                    step: "3",
                    title: "Guest menerima informasi transparan",
                    desc: "Pembeli melihat stok dan kualitas tanpa mengganggu proses internal.",
                  },
                ].map((timeline) => (
                  <div key={timeline.step} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-[#001B34]">
                      {timeline.step}
                    </div>
                    <div>
                      <p className="font-semibold text-[#001B34]">{timeline.title}</p>
                      <p>{timeline.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-12 text-center text-white">
            <h3 className="text-3xl font-semibold">
              Mari fokus pada operasi, bukan kebingungan peran.
            </h3>
            <p className="mt-4 text-lg text-white/80">
              Gunakan Poultrigo untuk menyatukan tim admin, operator, dan pembeli dalam satu
              bahasa digital.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-slate-100"
              >
                Daftar Sebagai Guest
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Masuk Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-10 text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Poultrigo. Semua hak dilindungi.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-[#001B34]">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-[#001B34]">
              Ketentuan Layanan
            </a>
            <a href="#" className="hover:text-[#001B34]">
              Bantuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

