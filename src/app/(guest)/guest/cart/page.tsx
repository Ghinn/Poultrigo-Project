import { getCart } from '@/actions/shop'
import CartClient from '@/components/guest/cart-client'

export const dynamic = 'force-dynamic';

export default async function CartPage() {
    try {
        const cart = await getCart()
        return <CartClient cart={cart} />
    } catch (error) {
        // Fallback if database connection fails during build
        return <CartClient cart={{ items: [], total: 0 }} />
    }
}
