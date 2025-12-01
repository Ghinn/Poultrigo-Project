'use server'

import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { revalidatePath } from 'next/cache'

export interface ProductDocument {
    _id: string;
    name: string;
    price: number;
    stock: number;
    image_url?: string;
    description?: string;
    status: string;
    created_at: Date;
}

export async function getProducts() {
    try {
        await dbConnect()
        const products = await Product.find({}).sort({ created_at: -1 }).lean()
        return (products as any[]).map((p: ProductDocument) => ({
            ...p,
            id: p._id.toString(),
            _id: p._id.toString(),
            createdAt: p.created_at ? p.created_at.toISOString() : new Date().toISOString(),
        }))
    } catch (error) {
        console.error('Failed to fetch products:', error)
        return []
    }
}

export async function createProduct(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
    const name = formData.get('name') as string
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const image_url = formData.get('image_url') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string || 'active'

    if (!name || isNaN(price) || isNaN(stock)) {
        return { error: 'Please fill in all required fields (Name, Price, Stock)' }
    }

    try {
        await dbConnect()

        await Product.create({
            name,
            price,
            stock,
            image_url,
            description,
            status,
            created_at: new Date()
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to create product:', error)
        return { error: `Failed to create product: ${(error as Error).message}` }
    }
}

export async function updateProduct(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const image_url = formData.get('image_url') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string

    if (!id || !name || isNaN(price) || isNaN(stock)) {
        return { error: 'Missing required fields' }
    }

    try {
        await dbConnect()

        const updateData: any = {
            name,
            price,
            stock,
            description,
            status
        }

        if (image_url) {
            updateData.image_url = image_url
        }

        await Product.findByIdAndUpdate(id, updateData)

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update product:', error)
        return { error: 'Failed to update product' }
    }
}

export async function deleteProduct(id: string) {
    try {
        await dbConnect()
        await Product.findByIdAndDelete(id)
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete product:', error)
        return { error: 'Failed to delete product' }
    }
}
