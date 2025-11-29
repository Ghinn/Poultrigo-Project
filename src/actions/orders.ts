'use server'

import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { revalidatePath } from 'next/cache'

interface OrderDocument {
    _id: { toString(): string };
    order_number?: string;
    user_id?: { name?: string; email?: string } | string;
    items: Array<{ product_name: string; quantity: number; price: number; subtotal: number }>;
    created_at: Date;
    total_amount?: number;
    status?: string;
    buyer_name?: string;
    user_email?: string;
    address?: string;
    whatsapp?: string;
}

export async function getOrders() {
    try {
        await dbConnect()
        const orders = await Order.find({})
            .populate('user_id', 'name email')
            .sort({ created_at: -1 })
            .lean()

        return orders.map((order: OrderDocument) => ({
            id: order._id.toString(),
            order_number: order.order_number || order._id.toString(),
            created_at: order.created_at.toISOString(),
            total_amount: order.total_amount || 0,
            status: order.status || 'pending',
            items: order.items || [],
            buyer_name: order.buyer_name || 'Unknown',
            user_email: (typeof order.user_id === 'object' && order.user_id?.email) || order.user_email || 'Unknown',
            address: order.address || '',
            whatsapp: order.whatsapp || ''
        }))
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function updateOrderStatus(id: string, status: string) {
    try {
        await dbConnect()
        await Order.findByIdAndUpdate(id, { status })
        revalidatePath('/admin/orders')
        return { success: `Order status updated to ${status}.` }
    } catch (err) {
        console.error(err)
        return { error: 'Error updating order status.' }
    }
}
