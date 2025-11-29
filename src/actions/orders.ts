'use server'

import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { revalidatePath } from 'next/cache'

interface OrderDocument {
    _id: { toString(): string };
    user_id?: { name?: string; email?: string } | string;
    items: Array<{ product_name: string; quantity: number; price: number; subtotal: number }>;
    created_at: Date;
}

export async function getOrders() {
    try {
        await dbConnect()
        const orders = await Order.find({})
            .populate('user_id', 'name email')
            .sort({ created_at: -1 })
            .lean()

        return orders.map((order: OrderDocument) => ({
            ...order,
            id: order._id.toString(),
            user_name: order.user_id?.name || 'Unknown',
            user_email: order.user_id?.email || 'Unknown',
            items: order.items // Items are already embedded
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
