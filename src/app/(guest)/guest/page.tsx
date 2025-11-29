import GuestDashboard from "@/components/dashboards/guest-dashboard";
import { getProducts, getCart, getOrders } from "@/actions/shop";

export default async function GuestPage() {
  const products = await getProducts();
  const cart = await getCart();
  const orders = await getOrders();
  return <GuestDashboard initialProducts={products} initialCart={cart} initialOrders={orders} />;
}
