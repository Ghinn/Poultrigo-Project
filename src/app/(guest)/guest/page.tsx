import GuestDashboard from "@/components/dashboards/guest-dashboard";
import { getProducts, getCart, getOrders } from "@/actions/shop";

export default async function GuestPage() {
  const products = await getProducts();
  const cart = await getCart();
  const orders = await getOrders();
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
