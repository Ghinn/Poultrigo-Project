import { getProducts } from '@/actions/shop'
import ProductsClient from '@/components/guest/products-client'

export default async function ProductsPage() {
    const products = await getProducts()
    return <ProductsClient products={products} />
}
