'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret-key')

async function getUserId() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    try {
        const { payload } = await jwtVerify(session, SECRET)
        return payload.id as number
    } catch (e) {
        return null
    }
}

export async function getProducts() {
    try {
        const [products] = await pool.execute("SELECT * FROM products WHERE status != 'out_of_stock' ORDER BY id")
        return products as any[]
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function addToCart(prevState: any, formData: FormData) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    const productId = formData.get('product_id') as string
    const quantity = parseInt(formData.get('quantity') as string || '1')

    try {
        const [products]: any = await pool.execute('SELECT stock FROM products WHERE id = ?', [productId])
        if (products.length === 0) return { error: 'Product not found.' }

        const product = products[0]
        const [cartItems]: any = await pool.execute('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId])

        if (cartItems.length > 0) {
            const newQuantity = cartItems[0].quantity + quantity
            if (newQuantity > product.stock) return { error: `Not enough stock. Available: ${product.stock} pcs` }

            await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, cartItems[0].id])
        } else {
            if (quantity > product.stock) return { error: `Not enough stock. Available: ${product.stock} pcs` }

            await pool.execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity])
        }
        revalidatePath('/guest')
        return { success: 'Item added to cart!' }
    } catch (err) {
        console.error(err)
        return { error: 'Error adding to cart.' }
    }
}

export async function getCart() {
    const userId = await getUserId()
    if (!userId) return { items: [], total: 0 }

    try {
        const [cartItems]: any = await pool.execute(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.stock, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId])

        const total = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
        return { items: cartItems, total }
    } catch (err) {
        console.error(err)
        return { items: [], total: 0 }
    }
}

export async function updateCart(prevState: any, formData: FormData) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    const cartItemId = formData.get('cart_item_id') as string
    const quantity = parseInt(formData.get('quantity') as string || '1')

    try {
        const [result]: any = await pool.execute(`
      SELECT p.stock FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ? AND ci.user_id = ?
    `, [cartItemId, userId])

        if (result.length === 0) return { error: 'Cart item not found.' }

        if (quantity > result[0].stock) return { error: `Not enough stock. Available: ${result[0].stock} pcs` }

        await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId])
        revalidatePath('/guest')
        return { success: 'Cart updated.' }
    } catch (err) {
        console.error(err)
        return { error: 'Error updating cart.' }
    }
}

export async function removeFromCart(id: number) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    try {
        await pool.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId])
        revalidatePath('/guest')
        return { success: 'Item removed.' }
    } catch (err) {
        console.error(err)
        return { error: 'Error removing item.' }
    }
}

export async function checkout(prevState: any, formData: FormData) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    const buyerName = formData.get('buyer_name') as string
    const address = formData.get('address') as string
    const whatsapp = formData.get('whatsapp') as string

    if (!buyerName || !address || !whatsapp) return { error: 'Please fill in all fields.' }

    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        const [cartItems]: any = await connection.execute(`
      SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId])

        if (cartItems.length === 0) {
            await connection.rollback()
            return { error: 'Cart is empty.' }
        }

        const total = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
        // Generate short order ID: ORD-XXXXXX (6 random alphanumeric chars)
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
        const orderNumber = `ORD-${randomStr}`

        const [orderResult]: any = await connection.execute(`
      INSERT INTO orders (user_id, order_number, total_amount, buyer_name, address, whatsapp, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `, [userId, orderNumber, total, buyerName, address, whatsapp])

        const orderId = orderResult.insertId

        for (let item of cartItems) {
            const subtotal = item.price * item.quantity
            await connection.execute(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.name, item.quantity, item.price, subtotal])

            await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id])
        }

        await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId])
        await connection.commit()

        // Redirect handled by client or return success URL
        return { success: `Order placed! Order Number: ${orderNumber}`, redirect: '/guest/orders' }
    } catch (err) {
        await connection.rollback()
        console.error(err)
        return { error: 'Error processing checkout.' }
    } finally {
        connection.release()
    }
}

export async function getOrders() {
    const userId = await getUserId()
    if (!userId) return []

    try {
        const [orders]: any = await pool.execute(`
            SELECT o.id, o.order_number, o.created_at, o.total_amount, o.status,
                   GROUP_CONCAT(oi.product_name SEPARATOR ', ') as products,
                   SUM(oi.quantity) as total_quantity
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [userId])

        return orders.map((order: any) => ({
            id: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            }),
            product: order.products,
            quantity: Number(order.total_quantity),
            total: `Rp ${parseFloat(order.total_amount).toLocaleString('id-ID')}`,
            status: order.status === 'pending' ? 'Sedang Diproses' :
                order.status === 'completed' ? 'Selesai' :
                    order.status === 'cancelled' ? 'Dibatalkan' : order.status
        }))
    } catch (err) {
        console.error(err)
        return []
    }
}
