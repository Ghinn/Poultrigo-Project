'use server'

import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import CartItem from '@/models/CartItem'
import Order from '@/models/Order'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret-key')

interface ProductDocument {
    _id: { toString(): string };
    name: string;
    price: number;
    stock: number;
    image_url?: string;
    status?: string;
}

interface CartItemDocument {
    _id: { toString(): string };
    quantity: number;
    product_id: ProductDocument | { _id: { toString(): string }; name: string; price: number; stock: number; image_url?: string };
    created_at?: Date;
}

interface OrderItem {
    product_name: string;
    quantity: number;
}

interface OrderDocument {
    order_number: string;
    created_at: Date;
    total_amount: number;
    status: string;
    items: OrderItem[];
}

async function getUserId() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    if (!session) return null
    try {
        const { payload } = await jwtVerify(session, SECRET)
        return payload.id as string // ID is string in Mongo/User model
    } catch {
        return null
    }
}

export async function getProducts() {
    try {
        await dbConnect()
        const products = await Product.find({ status: { $ne: 'out_of_stock' } }).sort({ id: 1 }).lean()
        return products.map((p: ProductDocument) => ({
            ...p,
            _id: p._id.toString(),
            id: p._id.toString()
        }))
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function addToCart(prevState: { error?: string; success?: string } | null, formData: FormData) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    const productId = formData.get('product_id') as string
    const quantity = parseInt(formData.get('quantity') as string || '1')

    try {
        await dbConnect()
        const product = await Product.findById(productId)
        if (!product) return { error: 'Product not found.' }

        const cartItem = await CartItem.findOne({ user_id: userId, product_id: productId })

        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity
            if (newQuantity > product.stock) return { error: `Not enough stock. Available: ${product.stock} pcs` }

            cartItem.quantity = newQuantity
            await cartItem.save()
        } else {
            if (quantity > product.stock) return { error: `Not enough stock. Available: ${product.stock} pcs` }

            await CartItem.create({
                user_id: userId,
                product_id: productId,
                quantity
            })
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
        await dbConnect()
        const cartItems = await CartItem.find({ user_id: userId })
            .populate('product_id')
            .sort({ created_at: -1 })
            .lean()

        const items = cartItems.map((item: CartItemDocument) => {
            const product = item.product_id as ProductDocument
            return {
                id: item._id.toString(),
                quantity: item.quantity,
                product_id: product._id.toString(),
                name: product.name,
                price: product.price,
                stock: product.stock,
                image_url: product.image_url
            }
        })

        const total = items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)
        return { items, total }
    } catch (err) {
        console.error(err)
        return { items: [], total: 0 }
    }
}

export async function updateCart(prevState: { error?: string; success?: string } | null, formData: FormData) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    const cartItemId = formData.get('cart_item_id') as string
    const quantity = parseInt(formData.get('quantity') as string || '1')

    try {
        await dbConnect()
        const cartItem = await CartItem.findOne({ _id: cartItemId, user_id: userId }).populate('product_id')

        if (!cartItem) return { error: 'Cart item not found.' }

        const product = cartItem.product_id
        if (quantity > product.stock) return { error: `Not enough stock. Available: ${product.stock} pcs` }

        cartItem.quantity = quantity
        await cartItem.save()

        revalidatePath('/guest')
        return { success: 'Cart updated.' }
    } catch (err) {
        console.error(err)
        return { error: 'Error updating cart.' }
    }
}

export async function removeFromCart(id: string) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    try {
        await dbConnect()
        await CartItem.deleteOne({ _id: id, user_id: userId })
        revalidatePath('/guest')
        return { success: 'Item removed.' }
    } catch (err) {
        console.error(err)
        return { error: 'Error removing item.' }
    }
}

export async function checkout(prevState: { error?: string; success?: string; redirect?: string } | null, formData: FormData) {
    const userId = await getUserId()
    if (!userId) return { error: 'Please login first.' }

    const buyerName = formData.get('buyer_name') as string
    const address = formData.get('address') as string
    const whatsapp = formData.get('whatsapp') as string

    if (!buyerName || !address || !whatsapp) return { error: 'Please fill in all fields.' }

    try {
        await dbConnect()

        const cartItems = await CartItem.find({ user_id: userId }).populate('product_id')

        if (cartItems.length === 0) {
            return { error: 'Cart is empty.' }
        }

        let total = 0
        const orderItems = []

        for (const item of cartItems) {
            const product = item.product_id
            if (item.quantity > product.stock) {
                return { error: `Not enough stock for ${product.name}` }
            }

            const subtotal = product.price * item.quantity
            total += subtotal

            orderItems.push({
                product_id: product._id,
                product_name: product.name,
                quantity: item.quantity,
                price: product.price,
                subtotal
            })

            // Update stock
            await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } })
        }

        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
        const orderNumber = `ORD-${randomStr}`

        await Order.create({
            user_id: userId,
            order_number: orderNumber,
            total_amount: total,
            buyer_name: buyerName,
            address,
            whatsapp,
            status: 'pending',
            items: orderItems
        })

        await CartItem.deleteMany({ user_id: userId })

        return { success: `Order placed! Order Number: ${orderNumber}`, redirect: '/guest/orders' }
    } catch (err) {
        console.error(err)
        return { error: 'Error processing checkout.' }
    }
}

export async function getOrders() {
    const userId = await getUserId()
    if (!userId) return []

    try {
        await dbConnect()
        const orders = await Order.find({ user_id: userId }).sort({ created_at: -1 }).lean()

        return orders.map((order: OrderDocument) => ({
            id: order.order_number,
            date: new Date(order.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            }),
            product: order.items.map((i: OrderItem) => i.product_name).join(', '),
            quantity: order.items.reduce((sum: number, i: OrderItem) => sum + i.quantity, 0),
            total: `Rp ${order.total_amount.toLocaleString('id-ID')}`,
            status: order.status === 'pending' ? 'Sedang Diproses' :
                order.status === 'completed' ? 'Selesai' :
                    order.status === 'cancelled' ? 'Dibatalkan' : order.status
        }))
    } catch (err) {
        console.error(err)
        return []
    }
}
