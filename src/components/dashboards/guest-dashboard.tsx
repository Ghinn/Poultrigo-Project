"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Trash,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight
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
import { setCurrentUser, getCurrentUser, User } from "@/utils/auth";
import { logout } from "@/actions/auth";
import { addToCart, updateCart, removeFromCart, checkout } from "@/actions/shop";
import { useToast } from "@/components/ui/toast-provider";

type GuestTab = "overview" | "products" | "orders" | "cart";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
  status?: string;
}

interface Order {
  id: string;
  date: string;
  product: string;
  quantity: number;
  total: string;
  status: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export function GuestDashboard({
  initialProducts = [],
  initialCart = { items: [], total: 0 },
  initialOrders = []
}: {
  initialProducts?: Product[],
  initialCart?: Cart,
  initialOrders?: Order[]
}) {
  const router = useRouter();
  const isClient = useIsClient();
  const [activeTab, setActiveTab] = useState<GuestTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      const formData = new FormData();
      formData.append("product_id", productId.toString());
      formData.append("quantity", "1");

      const result = await addToCart(null, formData);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast("Produk berhasil ditambahkan ke keranjang!", "success");
        router.refresh();
      }
    } catch {
      showToast("Gagal menambahkan ke keranjang", "error");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleUpdateCart = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    setCartLoading(true);
    const formData = new FormData();
    formData.append('cart_item_id', cartItemId);
    formData.append('quantity', newQty.toString());

    const res = await updateCart(null, formData);
    setCartLoading(false);
    if (res?.error) showToast(res.error, "error");
    else router.refresh();
  };

  const handleRemoveFromCart = async (id: string) => {
    if (!confirm('Hapus item ini?')) return;
    setCartLoading(true);
    const res = await removeFromCart(id);
    setCartLoading(false);
    if (res?.error) showToast(res.error, "error");
    else router.refresh();
  };

  const handleCheckout = async (formData: FormData) => {
    setCartLoading(true);
    const res = await checkout(null, formData);
    setCartLoading(false);
    if (res?.error) showToast(res.error, "error");
    else if (res?.redirect) {
      showToast(res.success || "Pesanan berhasil dibuat!", "success");
      setActiveTab('orders');
      router.refresh();
    }
  };

  const myOrders = initialOrders;

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
                  <div className="text-xs text-orange-100">{user?.name || "Guest / Pembeli"}</div>
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
              { id: "cart", label: "Keranjang", icon: ShoppingCart },
              { id: "orders", label: "Pesanan Saya", icon: Clock },
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
                  {activeTab === "overview" && "Beranda"}
                  {activeTab === "products" && "Produk"}
                  {activeTab === "cart" && "Keranjang Belanja"}
                  {activeTab === "orders" && "Pesanan Saya"}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                  {activeTab === "overview" && "Selamat datang di Poultrigo Store"}
                  {activeTab === "products" && "Lihat produk dan harga"}
                  {activeTab === "cart" && "Kelola item keranjang Anda"}
                  {activeTab === "orders" && "Kelola pesanan Anda"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("cart")}
                className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                title="Keranjang Belanja"
              >
                <ShoppingCart className="h-5 w-5" />
                {initialCart.items.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {initialCart.items.length}
                  </span>
                )}
              </button>
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
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg lg:p-10">
                  <div className="relative z-10 max-w-2xl">
                    <h2 className="mb-4 text-2xl font-bold lg:text-3xl">
                      Halo, {user?.name || "Pelanggan Setia"}! 👋
                    </h2>
                    <p className="mb-6 text-orange-50 lg:text-lg">
                      Selamat datang kembali di Poultrigo. Temukan produk ayam berkualitas terbaik langsung dari peternakan kami. Segar, sehat, dan terpercaya.
                    </p>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-orange-600 transition-colors hover:bg-orange-50"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Mulai Belanja
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Image
                      src="/Logo/Logo Poultrigo_Navy_Primary.svg"
                      alt="Background"
                      width={400}
                      height={400}
                      className="h-64 w-64 lg:h-96 lg:w-96"
                    />
                  </div>
                </div>

                {/* Buyer Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div
                    onClick={() => setActiveTab("cart")}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{initialCart.items.length}</div>
                        <div className="text-sm text-slate-500">Item di Keranjang</div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setActiveTab("orders")}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{initialOrders.length}</div>
                        <div className="text-sm text-slate-500">Total Pesanan</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Products Preview */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#001B34]">Produk Unggulan</h3>
                      <p className="text-sm text-slate-600">Pilihan terbaik untuk Anda</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      Lihat Semua <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    {initialProducts.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="group cursor-pointer overflow-hidden rounded-lg border border-slate-100 transition-all hover:border-orange-200 hover:shadow-md"
                        onClick={() => setActiveTab("products")}
                      >
                        <div className="relative h-40 bg-slate-100">
                          <ImageWithFallback
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="mb-1 font-semibold text-slate-900">{product.name}</h4>
                          <p className="font-medium text-orange-600">Rp {product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders Preview */}
                {initialOrders.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#001B34]">Pesanan Terakhir</h3>
                        <p className="text-sm text-slate-600">Status pesanan terbaru Anda</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Lihat Semua <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {initialOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-slate-100 p-2">
                              <Package className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{order.product}</div>
                              <div className="text-xs text-slate-500">{order.date} • {order.id}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-900">{order.total}</div>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                                }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    {initialProducts.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-slate-500">
                        Belum ada produk yang tersedia saat ini.
                      </div>
                    ) : (
                      initialProducts.map((product: Product) => (
                        <div
                          key={product.id}
                          className="overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-lg"
                        >
                          <div className="relative h-48">
                            <ImageWithFallback
                              src={product.image_url || '/placeholder.png'}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                            <div
                              className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs ${product.stock > 0
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                                }`}
                            >
                              {product.stock > 0 ? "Tersedia" : "Stok Habis"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="mb-2 text-[#001B34]">{product.name}</h4>
                            <p className="mb-3 text-xs text-slate-500 line-clamp-2">{product.description}</p>
                            <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                              <span>Stok: {product.stock}</span>
                              <span className="font-semibold text-orange-600">
                                Rp {product.price.toLocaleString()}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product.id)}
                              disabled={product.stock === 0 || addingToCart === product.id}
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-2 text-white transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              {addingToCart === product.id ? "Menambahkan..." : "Tambah ke Keranjang"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cart" && (
              <div className="space-y-6">
                {initialCart.items.length === 0 ? (
                  <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <ShoppingCart className="h-10 w-10 text-slate-400" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-slate-900">Keranjang Anda Kosong</h2>
                    <p className="mb-8 text-slate-500">Sepertinya Anda belum menambahkan apapun.</p>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
                    >
                      Mulai Belanja
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                      {initialCart.items.map((item) => (
                        <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <ImageWithFallback
                              src={item.image_url || '/placeholder.png'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-bold text-slate-900">{item.name}</h3>
                                <div className="text-sm text-slate-500">Rp {item.price.toLocaleString()}</div>
                              </div>
                              <button onClick={() => handleRemoveFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-1">
                                <button
                                  onClick={() => handleUpdateCart(item.id, item.quantity - 1)}
                                  className="rounded p-1 hover:bg-slate-100"
                                >
                                  <Minus className="h-4 w-4 text-slate-600" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-slate-900">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateCart(item.id, item.quantity + 1)}
                                  className="rounded p-1 hover:bg-slate-100"
                                >
                                  <Plus className="h-4 w-4 text-slate-600" />
                                </button>
                              </div>
                              <div className="font-bold text-slate-900">
                                Rp {(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-lg font-bold text-slate-900">Ringkasan Pesanan</h2>
                      <div className="mb-6 space-y-2 border-b border-slate-100 pb-6">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span>Rp {initialCart.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Total</span>
                          <span>Rp {initialCart.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <form action={handleCheckout} className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                          <input name="buyer_name" required className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Alamat</label>
                          <textarea name="address" required rows={3} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Nomor WhatsApp</label>
                          <input name="whatsapp" required placeholder="Contoh: 08123456789" className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-orange-500" />
                        </div>
                        <button
                          disabled={cartLoading}
                          className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                        >
                          {cartLoading ? 'Memproses...' : 'Checkout'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
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
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${order.status === "Delivered"
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
