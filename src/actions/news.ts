'use server'

import dbConnect from '@/lib/mongodb'
import News from '@/models/News'
import { revalidatePath } from 'next/cache'

import { type NewsArticle } from '@/utils/news'

export async function getNews(): Promise<NewsArticle[]> {
    try {
        await dbConnect()
        const news = await News.find({}).sort({ createdAt: -1 }).lean()
        return news.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
            publishedAt: item.createdAt.toISOString(), // Use createdAt as publishedAt for now
        })) as NewsArticle[]
    } catch (error) {
        console.error('Error fetching news:', error)
        return []
    }
}

export async function getPublishedNews(): Promise<NewsArticle[]> {
    try {
        await dbConnect()
        const news = await News.find({ published: true }).sort({ createdAt: -1 }).lean()
        return news.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
            publishedAt: item.createdAt.toISOString(),
        })) as NewsArticle[]
    } catch (error) {
        console.error('Error fetching published news:', error)
        return []
    }
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
    try {
        await dbConnect()
        const news = await News.findById(id).lean()
        if (!news) return null
        return {
            ...news,
            id: news._id.toString(),
            _id: news._id.toString(),
            createdAt: news.createdAt.toISOString(),
            updatedAt: news.updatedAt.toISOString(),
            publishedAt: news.createdAt.toISOString(),
        } as NewsArticle
    } catch (error) {
        console.error('Error fetching news by id:', error)
        return null
    }
}

export async function createNews(prevState: any, formData: FormData) {
    try {
        await dbConnect()

        const title = formData.get('title') as string
        const excerpt = formData.get('excerpt') as string
        const content = formData.get('content') as string
        const category = formData.get('category') as string
        const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag)
        const published = formData.get('published') === 'true'
        const featuredImage = formData.get('featuredImage') as string
        const author = formData.get('author') as string
        const authorId = formData.get('authorId') as string

        const newNews = new News({
            title,
            excerpt,
            content,
            category,
            tags,
            published,
            featuredImage,
            author,
            authorId,
        })

        await newNews.save()
        revalidatePath('/admin')
        revalidatePath('/news')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating news:', error)
        return { error: error.message }
    }
}

export async function updateNews(prevState: any, formData: FormData) {
    try {
        await dbConnect()

        const id = formData.get('id') as string
        const title = formData.get('title') as string
        const excerpt = formData.get('excerpt') as string
        const content = formData.get('content') as string
        const category = formData.get('category') as string
        const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag)
        const published = formData.get('published') === 'true'
        const featuredImage = formData.get('featuredImage') as string

        const updateData: any = {
            title,
            excerpt,
            content,
            category,
            tags,
            published,
        }

        if (featuredImage) {
            updateData.featuredImage = featuredImage
        }

        await News.findByIdAndUpdate(id, updateData)
        revalidatePath('/admin')
        revalidatePath('/news')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating news:', error)
        return { error: error.message }
    }
}

export async function deleteNews(id: string) {
    try {
        await dbConnect()
        await News.findByIdAndDelete(id)
        revalidatePath('/admin')
        revalidatePath('/news')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting news:', error)
        return { error: error.message }
    }
}

export async function incrementNewsViews(id: string) {
    try {
        await dbConnect()
        await News.findByIdAndUpdate(id, { $inc: { views: 1 } })
        revalidatePath('/news')
    } catch (error) {
        console.error('Error incrementing views:', error)
    }
}
