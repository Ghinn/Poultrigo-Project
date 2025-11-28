'use client'

import { useState } from 'react'
import { updateCart, removeFromCart, checkout } from '@/actions/shop'
import { Trash, Minus, Plus, ShoppingBag } from 'lucide-react'
import ImageWithFallback from '@/components/shared/image-with-fallback'

export default function CartClient({ cart }: { cart: { items: any[], total: number } }) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleUpdate(cartItemId: number, newQty: number) {
        if (newQty < 1) return
        setIsLoading(true)
        const formData = new FormData()
        formData.append('cart_item_id', cartItemId.toString())
        formData.append('quantity', newQty.toString())

        const res = await updateCart(null, formData)
        setIsLoading(false)
        if (res?.error) alert(res.error)
    }

    async function handleRemove(id: number) {
        if (!confirm('Remove this item?')) return
        setIsLoading(true)
        const res = await removeFromCart(id)
        setIsLoading(false)
        if (res?.error) alert(res.error)
    }

    async function handleCheckout(formData: FormData) {
        setIsLoading(true)
        const res = await checkout(null, formData)
        setIsLoading(false)
        if (res?.error) alert(res.error)
        else if (res?.redirect) window.location.href = res.redirect
    }

    if (cart.items.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <ShoppingBag className="h-10 w-10 text-slate-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Your cart is empty</h2>
                <p className="mb-8 text-slate-500">Looks like you haven't added anything yet.</p>
                <a href="/guest/products" className="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600">
                    Start Shopping
                </a>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
                <p className="text-slate-500">Review your items and checkout</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {cart.items.map((item) => (
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
                                    <button onClick={() => handleRemove(item.id)} className="text-slate-400 hover:text-red-500">
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-1">
                                        <button
                                            onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                            className="rounded p-1 hover:bg-slate-100"
                                        >
                                            <Minus className="h-4 w-4 text-slate-600" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdate(item.id, item.quantity + 1)}
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
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Order Summary</h2>
                    <div className="mb-6 space-y-2 border-b border-slate-100 pb-6">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>Rp {cart.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900">
                            <span>Total</span>
                            <span>Rp {cart.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <form action={handleCheckout} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                            <input name="buyer_name" required className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
                            <textarea name="address" required rows={3} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp Number</label>
                            <input name="whatsapp" required placeholder="e.g. 08123456789" className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                        </div>
                        <button
                            disabled={isLoading}
                            className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Checkout'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
