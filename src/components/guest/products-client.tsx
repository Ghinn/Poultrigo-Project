'use client'

import { useState } from 'react'
import { addToCart } from '@/actions/shop'
import { ShoppingCart, Plus } from 'lucide-react'
import ImageWithFallback from '@/components/shared/image-with-fallback'

export default function ProductsClient({ products }: { products: any[] }) {
    const [isLoading, setIsLoading] = useState<number | null>(null)

    async function handleAddToCart(productId: number) {
        setIsLoading(productId)
        const formData = new FormData()
        formData.append('product_id', productId.toString())
        formData.append('quantity', '1')

        const res = await addToCart(null, formData)
        setIsLoading(null)

        if (res?.error) alert(res.error)
        else alert(res.success) // Replace with toast
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                <p className="text-slate-500">Browse our available products</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <div key={product.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                            <ImageWithFallback
                                src={product.image_url || '/placeholder.png'}
                                alt={product.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm">
                                Stock: {product.stock}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="mb-1 font-bold text-slate-900">{product.name}</h3>
                            <div className="mb-4 text-lg font-bold text-orange-600">Rp {product.price.toLocaleString()}</div>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                disabled={isLoading === product.id || product.stock === 0}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                {isLoading === product.id ? (
                                    'Adding...'
                                ) : (
                                    <>
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
