import { getOrders } from '@/actions/orders'
import OrdersClient from '@/components/admin/orders-client'

export const dynamic = 'force-dynamic';

interface Order {
    id: string;
    order_number: string;
    created_at: string;
    total_amount: number;
    status: string;
    items: Array<{ product_name: string; price: number; quantity: number; subtotal: number }>;
    buyer_name: string;
    user_email: string;
    address: string;
    whatsapp: string;
}

export default async function OrdersPage() {
    let orders: Order[] = [];
    try {
        orders = await getOrders();
    } catch (error) {
        // Fallback if database connection fails during build
        console.error('Error loading orders:', error);
    }
    return <OrdersClient orders={orders} />
}
