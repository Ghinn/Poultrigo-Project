'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getAllOrders() {
    try {
        const [orders]: any = await pool.execute(`
            SELECT o.id, o.order_number, o.created_at, o.total_amount, o.status, o.buyer_name, o.address, o.whatsapp,
                   u.email as user_email,
                   GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') as products
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `)

        return orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            customer: {
                name: order.buyer_name,
                email: order.user_email,
                whatsapp: order.whatsapp,
                address: order.address
            },
            products: order.products,
            total: order.total_amount,
            status: order.status
        }))
    } catch (error) {
        console.error('Failed to fetch all orders:', error)
        return []
    }
}

export async function updateOrderStatus(orderId: number, status: string) {
    try {
        await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId])
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { error: 'Failed to update order status' }
    }
}
