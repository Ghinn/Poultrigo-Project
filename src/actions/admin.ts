'use server'

import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { revalidatePath } from 'next/cache'

interface OrderItem {
    product_name: string;
    quantity: number;
}

interface OrderDocument {
    _id: { toString(): string };
    order_number: string;
    created_at: Date;
    buyer_name: string;
    user_id?: { email?: string } | string;
    whatsapp: string;
    address: string;
    items: OrderItem[];
    total_amount: number;
    status: string;
}

export async function getAllOrders() {
    try {
        await dbConnect()
        // Populate user details. Items are embedded in Order.
        const orders = await Order.find({})
            .populate('user_id', 'email') // Populate email from User model
            .sort({ created_at: -1 })
            .lean()

        return orders.map((order: OrderDocument) => ({
            id: order._id.toString(),
            orderNumber: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            customer: {
                name: order.buyer_name,
                email: (typeof order.user_id === 'object' && order.user_id?.email) || 'N/A',
                whatsapp: order.whatsapp,
                address: order.address
            },
            products: order.items.map((item: OrderItem) => `${item.product_name} (${item.quantity})`).join(', '),
            total: order.total_amount,
            status: order.status
        }))
    } catch (error) {
        console.error('Failed to fetch all orders:', error)
        return []
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await dbConnect()
        await Order.findByIdAndUpdate(orderId, { status })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { error: 'Failed to update order status' }
    }
}
