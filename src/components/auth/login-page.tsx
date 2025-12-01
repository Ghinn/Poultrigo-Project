"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import ImageWithFallback from "@/components/shared/image-with-fallback";
import { setCurrentUser } from "@/utils/auth";
import { login } from "@/actions/auth";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const registered = searchParams?.get("registered") === "true";
  const successMessage = registered
    ? "Registrasi berhasil! Silakan masuk dengan akun Anda."
    : "";

  useEffect(() => {
    // Clear client-side session when on login page
    if (typeof window !== "undefined") {
      localStorage.removeItem("poultrigo_current_user");
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(null, formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success && result?.user) {
      // Set user in local storage
      setCurrentUser(result.user);

      // Redirect based on role
      if (result.user.role === 'admin') router.push('/admin');
      else if (result.user.role === 'operator') router.push('/operator');
      else if (result.user.role === 'guest') router.push('/guest');
      else router.push('/');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#001B34] via-[#002952] to-[#001B34]">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-orange-500 blur-3xl sm:h-96 sm:w-96" />
        <div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-red-500 blur-3xl sm:h-96 sm:w-96"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between px-4 pt-4 text-white sm:px-6 sm:pt-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Kembali ke Beranda</span>
          <span className="sm:hidden">Kembali</span>
        </button>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pb-8 sm:min-h-[calc(100vh-96px)] sm:px-6 sm:pb-12">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="hidden space-y-6 text-white lg:block">
            <div className="mb-8">
              <Image
                src="/Logo/Logo Poultrigo_Tagline.svg"
                alt="Poultrigo - Predict, Feed, Grow"
                width={280}
                height={120}
                className="h-auto w-56 lg:w-64"
                priority
              />
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

          <div className="relative z-20 rounded-2xl bg-white p-8 shadow-2xl lg:p-12" style={{ pointerEvents: "auto" }}>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl text-[#001B34]">Masuk</h2>
              <p className="text-slate-600">
                Gunakan kredensial akun Poultrigo Anda
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form className="relative z-30 space-y-6" onSubmit={handleLogin}>
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
                    className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 placeholder:text-slate-400 caret-orange-500 focus:border-orange-500 focus:outline-none"
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
                    className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 caret-orange-500 focus:border-orange-500 focus:outline-none"
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
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-white transition-all hover:shadow-xl hover:shadow-orange-500/30"
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

