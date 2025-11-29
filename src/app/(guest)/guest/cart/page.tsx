import { getCart } from '@/actions/shop'
import CartClient from '@/components/guest/cart-client'

export default async function CartPage() {
    const cart = await getCart()
    return <CartClient cart={cart} />
}
