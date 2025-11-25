"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import ImageWithFallback from "@/components/shared/image-with-fallback";

export function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/login");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#001B34] via-[#002952] to-[#001B34]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500 blur-3xl" />
        <div
          className="absolute bottom-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-red-500 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute left-8 top-8 z-10 flex items-center gap-2 text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Kembali ke Beranda
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="hidden space-y-6 text-white lg:block">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl">
                <Activity className="h-9 w-9 text-white" />
              </div>
              <div>
                <div className="text-3xl tracking-tight">Poultrigo</div>
                <div className="text-sm text-slate-300">
                  Platform Operasional Peternakan Ayam
                </div>
              </div>
            </div>
            <h1 className="text-4xl leading-tight lg:text-5xl">
              Mulai perjalanan digitalisasi peternakan Anda
            </h1>
            <p className="text-lg leading-relaxed text-slate-300">
              Bergabunglah dengan Poultrigo untuk memanfaatkan IoT dan analitik agar
              keputusan kandang lebih cepat dan akurat.
            </p>
            <div className="space-y-4 pt-8">
              {[
                {
                  title: "Pemantauan real-time",
                  desc: "Akses 24/7 terhadap kondisi kandang dan sensor",
                },
                {
                  title: "Analitik berbasis AI",
                  desc: "Prediksi kebutuhan pakan dan kesehatan populasi",
                },
                {
                  title: "Notifikasi otomatis",
                  desc: "Peringatan langsung untuk kondisi kritis",
                },
                {
                  title: "Dasbor ringkas",
                  desc: "Grafik, laporan, dan ringkasan siap pakai",
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                  <div>
                    <div className="mb-1 text-white">{benefit.title}</div>
                    <div className="text-sm text-slate-300">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-white/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1697545698404-46828377ae9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Modern Poultry Farm"
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001B34]/80 to-transparent" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl text-[#001B34]">Buat Akun</h2>
              <p className="text-slate-600">
                Dapatkan akses transparan ke peternakan digital Poultrigo
              </p>
            </div>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Catatan:</strong> Anda mendaftar sebagai{" "}
                <strong>Guest/Pembeli</strong>. Akun Operator hanya dapat dibuat oleh
                Admin.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Nama lengkap
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-lg border-2 border-slate-200 py-3 pl-12 pr-4 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Alamat email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full rounded-lg border-2 border-slate-200 py-3 pl-12 pr-4 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Nomor telepon (opsional)
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+62 xxx xxxx xxxx"
                    className="w-full rounded-lg border-2 border-slate-200 py-3 pl-12 pr-4 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Kata sandi
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-lg border-2 border-slate-200 py-3 pl-12 pr-12 focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Konfirmasi kata sandi
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full rounded-lg border-2 border-slate-200 py-3 pl-12 pr-12 focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <span>
                  Saya setuju dengan{" "}
                  <a href="#" className="text-orange-600 hover:text-orange-700">
                    Syarat & Ketentuan
                  </a>{" "}
                  serta{" "}
                  <a href="#" className="text-orange-600 hover:text-orange-700">
                    Kebijakan Privasi
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-white transition-all hover:shadow-xl hover:shadow-orange-500/30"
              >
                Daftar Sekarang
              </button>

              <div className="relative my-6 text-center text-sm text-slate-500">
                <span className="bg-white px-4">Sudah punya akun?</span>
                <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full rounded-lg border-2 border-slate-200 py-3.5 text-slate-700 transition-all hover:bg-slate-50"
              >
                Masuk saja
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

