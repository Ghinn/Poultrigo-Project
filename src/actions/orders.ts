'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getOrders() {
    try {
        const [orders]: any = await pool.execute(`
      SELECT o.id, o.order_number, o.created_at, o.status, o.total_amount,
             o.buyer_name, o.address, o.whatsapp,
             u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)

        for (let order of orders) {
            const [items]: any = await pool.execute(`
        SELECT product_name, quantity, price, subtotal 
        FROM order_items 
        WHERE order_id = ?
      `, [order.id])
            order.items = items
        }
        return orders
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function updateOrderStatus(id: number, status: string) {
    try {
        await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id])
        revalidatePath('/admin/orders')
        return { success: `Order status updated to ${status}.` }
    } catch (err) {
        console.error(err)
        return { error: 'Error updating order status.' }
    }
}
