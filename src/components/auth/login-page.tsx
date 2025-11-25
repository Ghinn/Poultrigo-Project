"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Gauge,
  User,
} from "lucide-react";
import ImageWithFallback from "@/components/shared/image-with-fallback";

type RoleOption = "guest" | "operator" | "admin";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleOption>("operator");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextPath =
      selectedRole === "admin"
        ? "/admin"
        : selectedRole === "operator"
          ? "/operator"
          : "/guest";

    router.push(nextPath);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#001B34] via-[#002952] to-[#001B34]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500 blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-red-500 blur-3xl"
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
            <h1 className="text-4xl leading-tight">
              Selamat datang kembali di dasbor peternakan Anda
            </h1>
            <p className="text-lg leading-relaxed text-slate-300">
              Masuk untuk mengakses pemantauan sensor, analitik populasi, dan kontrol
              perangkat IoT secara terpadu.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                { value: "24/7", label: "Pemantauan" },
                { value: "99.9%", label: "Ketersediaan" },
                { value: "Realtime", label: "Data Lapangan" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="mb-1 text-2xl text-orange-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-white/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Smart Farming Dashboard"
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001B34]/80 to-transparent" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl text-[#001B34]">Masuk</h2>
              <p className="text-slate-600">
                Gunakan kredensial akun Poultrigo Anda
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  Pilih peran
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as RoleOption)}
                    className="w-full appearance-none rounded-lg border-2 border-slate-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="guest">Guest / Pembeli</option>
                    <option value="operator">Operator Kandang</option>
                    <option value="admin">Admin Developer</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      selectedRole === "admin"
                        ? "bg-gradient-to-br from-[#001B34] to-[#003561]"
                        : selectedRole === "operator"
                          ? "bg-gradient-to-br from-orange-500 to-orange-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                    }`}
                  >
                    {selectedRole === "admin" ? (
                      <Shield className="h-5 w-5 text-white" />
                    ) : selectedRole === "operator" ? (
                      <Gauge className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Masuk sebagai</div>
                    <div className="text-[#001B34]">
                      {selectedRole === "admin"
                        ? "Admin Developer"
                        : selectedRole === "operator"
                          ? "Operator Kandang"
                          : "Guest / Pembeli"}
                    </div>
                  </div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  Ingat saya
                </label>
                <a
                  href="#"
                  className="text-sm text-orange-600 transition-colors hover:text-orange-700"
                >
                  Lupa kata sandi?
                </a>
              </div>

              <button
                type="submit"
                className={`w-full rounded-lg py-3.5 text-white transition-all ${
                  selectedRole === "admin"
                    ? "bg-gradient-to-r from-[#001B34] to-[#003561] hover:shadow-xl"
                    : selectedRole === "operator"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-xl hover:shadow-orange-500/30"
                      : "bg-gradient-to-r from-slate-500 to-slate-600 hover:shadow-xl"
                }`}
              >
                Masuk ke Dashboard
              </button>

              <div className="relative my-6 text-center text-sm text-slate-500">
                <span className="bg-white px-4">Belum punya akun?</span>
                <div className="absolute inset-x-0 top-1/2 -z-10 h-px w-full bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className="w-full rounded-lg border-2 border-orange-500 py-3.5 text-orange-600 transition-all hover:bg-orange-50"
              >
                Buat Akun Baru
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

