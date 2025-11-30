import GuestDashboard from "@/components/dashboards/guest-dashboard";
import { getProducts, getCart, getOrders } from "@/actions/shop";

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  description?: string;
  status?: string;
}

interface Order {
  id: string;
  date: string;
  product: string;
  quantity: number;
  total: string;
  status: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default async function GuestPage() {
  let products: Product[] = [];
  let cart: Cart = { items: [], total: 0 };
  let orders: Order[] = [];
  
  try {
    products = await getProducts();
    cart = await getCart();
    orders = await getOrders();
  } catch (error) {
    // Fallback if database connection fails during build
    console.error('Error loading guest page data:', error);
  }
  
  // Ensure cart items have image_url as string (not undefined)
  const cartWithDefaults = {
    ...cart,
    items: cart.items.map(item => ({
      ...item,
      image_url: item.image_url || '/placeholder.png'
    }))
  };
  return <GuestDashboard initialProducts={products} initialCart={cartWithDefaults} initialOrders={orders} />;
}
