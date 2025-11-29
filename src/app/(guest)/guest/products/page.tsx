import { getProducts } from '@/actions/shop'
import ProductsClient from '@/components/guest/products-client'

export const dynamic = 'force-dynamic';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    image_url?: string;
    description?: string;
}

export default async function ProductsPage() {
    let products: Product[] = [];
    try {
        products = await getProducts();
    } catch (error) {
        // Fallback if database connection fails during build
        console.error('Error loading products:', error);
    }
    return <ProductsClient products={products} />
}
