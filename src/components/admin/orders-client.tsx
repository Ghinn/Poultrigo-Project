'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/actions/orders'
import { Package, ChevronDown, ChevronUp, MapPin, Phone, User } from 'lucide-react'
import { useToast } from "@/components/ui/toast-provider"

interface OrderItem {
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface Order {
    id: string;
    order_number: string;
    created_at: string;
    total_amount: number;
    status: string;
    items: OrderItem[];
    buyer_name: string;
    user_email: string;
    address: string;
    whatsapp: string;
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { showToast } = useToast()

    async function handleStatusChange(id: string, newStatus: string) {
        if (isLoading) return
        setIsLoading(true)
        const res = await updateOrderStatus(id.toString(), newStatus)
        setIsLoading(false)
        if (res?.error) showToast(res.error, "error")
        else showToast("Order status updated", "success")
    }

    const toggleOrder = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id)
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                <p className="text-slate-500">Track and manage customer orders</p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{order.order_number}</div>
                                    <div className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">Rp {order.total_amount.toLocaleString()}</div>
                                    <div className="text-xs text-slate-500">{order.items.length} Items</div>
                                </div>

                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    disabled={isLoading}
                                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20 ${order.status === 'pending' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                                        order.status === 'processing' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                            order.status === 'shipped' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                                                order.status === 'completed' ? 'border-green-200 bg-green-50 text-green-700' :
                                                    'border-red-200 bg-red-50 text-red-700'
                                        }`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                                <button
                                    onClick={() => toggleOrder(order.id)}
                                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    {expandedOrderId === order.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {expandedOrderId === order.id && (
                            <div className="bg-slate-50 p-4">
                                <div className="mb-4 grid gap-4 sm:grid-cols-3">
                                    <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                                        <User className="mt-0.5 h-4 w-4 text-slate-400" />
                                        <div>
                                            <div className="text-xs font-medium text-slate-500">Customer</div>
                                            <div className="text-sm font-medium text-slate-900">{order.buyer_name}</div>
                                            <div className="text-xs text-slate-500">{order.user_email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                                        <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                                        <div>
                                            <div className="text-xs font-medium text-slate-500">Address</div>
                                            <div className="text-sm text-slate-900">{order.address}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                                        <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                                        <div>
                                            <div className="text-xs font-medium text-slate-500">Contact</div>
                                            <div className="text-sm text-slate-900">{order.whatsapp}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Product</th>
                                                <th className="px-4 py-2 font-medium">Price</th>
                                                <th className="px-4 py-2 font-medium">Qty</th>
                                                <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {order.items.map((item: OrderItem, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 text-slate-900">{item.product_name}</td>
                                                    <td className="px-4 py-2 text-slate-500">Rp {item.price.toLocaleString()}</td>
                                                    <td className="px-4 py-2 text-slate-500">{item.quantity}</td>
                                                    <td className="px-4 py-2 text-right font-medium text-slate-900">Rp {item.subtotal.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
