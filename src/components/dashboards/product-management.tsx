"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    X,
    Save,
    Package,
    Upload,
    DollarSign,
    Box,
} from "lucide-react";
import {
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
} from "@/actions/products";
import { useToast } from "@/components/ui/toast-provider";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    image_url?: string;
    description?: string;
    status: string;
    createdAt: string;
}

type ModalMode = "create" | "edit" | null;

export function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        status: "active",
        image_url: "",
    });

    const { showToast } = useToast();

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    useEffect(() => {
        void loadProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setFormData({
            name: "",
            price: 0,
            stock: 0,
            description: "",
            status: "active",
            image_url: "",
        });
        setImagePreview("");
        setSelectedProduct(null);
        setModalMode("create");
    };

    const handleOpenEdit = (product: Product) => {
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            status: product.status,
            image_url: product.image_url || "",
        });
        setImagePreview(product.image_url || "");
        setSelectedProduct(product);
        setModalMode("edit");
    };

    const handleCloseModal = () => {
        setModalMode(null);
        setSelectedProduct(null);
        setImagePreview("");
        setFormData({
            name: "",
            price: 0,
            stock: 0,
            description: "",
            status: "active",
            image_url: "",
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setFormData({ ...formData, image_url: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.name || formData.price < 0 || formData.stock < 0) {
            showToast("Harap lengkapi data dengan benar.", "error");
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price.toString());
        data.append("stock", formData.stock.toString());
        data.append("description", formData.description);
        data.append("status", formData.status);
        data.append("image_url", formData.image_url);

        let result;
        if (modalMode === "create") {
            result = await createProduct(null, data);
        } else if (modalMode === "edit" && selectedProduct) {
            data.append("id", selectedProduct.id);
            result = await updateProduct(null, data);
        }

        if (result?.error) {
            showToast(result.error, "error");
        } else {
            showToast(
                modalMode === "create"
                    ? "Produk berhasil dibuat!"
                    : "Produk berhasil diperbarui!",
                "success"
            );
            await loadProducts();
            handleCloseModal();
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            const result = await deleteProduct(id);
            if (result?.error) {
                showToast(result.error, "error");
            } else {
                showToast("Produk berhasil dihapus!", "success");
                await loadProducts();
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[#001B34]">Kelola Produk</h2>
                    <p className="text-sm text-slate-600">
                        Atur katalog produk, harga, dan stok
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Produk
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Product List */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center">
                        <Package className="h-12 w-12 text-slate-400" />
                        <p className="mt-4 text-slate-500">Tidak ada produk ditemukan.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg"
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                        <Package className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => handleOpenEdit(product)}
                                        className="rounded-full bg-white p-2 text-orange-600 shadow-sm hover:bg-orange-50"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="rounded-full bg-white p-2 text-red-600 shadow-sm hover:bg-red-50"
                                        title="Hapus"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="mb-1 font-semibold text-[#001B34] line-clamp-1" title={product.name}>
                                    {product.name}
                                </h3>
                                <p className="mb-4 text-sm text-slate-500 line-clamp-2">
                                    {product.description || "Tidak ada deskripsi"}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="font-bold text-orange-600">
                                        {formatCurrency(product.price)}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Box className="h-3.5 w-3.5" />
                                        Stok: {product.stock}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-6">
                            <h3 className="text-xl font-semibold text-[#001B34]">
                                {modalMode === "create" ? "Tambah Produk Baru" : "Edit Produk"}
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                            className="space-y-6 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                                    placeholder="Contoh: Pakan Ayam A1"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Harga (Rp) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Stok *
                                    </label>
                                    <div className="relative">
                                        <Box className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                                    placeholder="Deskripsi produk..."
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Gambar Produk
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="product-image-upload"
                                        />
                                        <label
                                            htmlFor="product-image-upload"
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                                        </label>
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div className="mt-2 relative h-40 w-full overflow-hidden rounded-lg border border-slate-200">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-contain bg-slate-50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview("");
                                                setFormData({ ...formData, image_url: "" });
                                            }}
                                            className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-slate-600 hover:bg-white hover:text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {isLoading ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
