'use server'

import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User' // Ensure User model is imported for population if needed
import { revalidatePath } from 'next/cache'

export async function getAllOrders() {
    try {
        await dbConnect()
        // Populate user details. Items are embedded in Order.
        const orders = await Order.find({})
            .populate('user_id', 'email') // Populate email from User model
            .sort({ created_at: -1 })
            .lean()

        return orders.map((order: any) => ({
            id: order._id.toString(), // Use _id or order_number depending on frontend expectation. SQL used id (int). 
            // The frontend likely expects `id` to be passed to updateOrderStatus.
            // Let's check updateOrderStatus signature: it takes `orderId: number`.
            // This is a problem. Mongo IDs are strings.
            // I should update the frontend or change the signature.
            // For now, I will cast to string in the map, but the function signature in `updateOrderStatus` needs to change to string.
            orderNumber: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            customer: {
                name: order.buyer_name,
                email: order.user_id?.email || 'N/A', // Access populated email
                whatsapp: order.whatsapp,
                address: order.address
            },
            products: order.items.map((item: any) => `${item.product_name} (${item.quantity})`).join(', '),
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
