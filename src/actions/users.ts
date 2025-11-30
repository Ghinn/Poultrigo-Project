'use server'

import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

interface UserDocument {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "guest" | "operator" | "admin";
    created_at?: Date;
    last_login?: Date;
}

export async function getUsers() {
    try {
        await dbConnect()
        const users = await User.find({}).sort({ created_at: -1 }).lean()
        // Map _id to id to match interface if needed, but User model uses string _id manually set as id.
        // Wait, my User model has `_id: { type: String }`. So `_id` IS the id.
        // But Mongoose returns `_id`.
        return (users as any[]).map((u: UserDocument) => ({
            ...u,
            id: u._id,
            createdAt: u.created_at ? u.created_at.toISOString() : new Date().toISOString(),
            last_login: u.last_login ? (typeof u.last_login === 'string' ? u.last_login : u.last_login.toISOString()) : undefined
        }))
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return []
    }
}

export async function createUser(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    if (!name || !email || !password || !role) {
        return { error: 'Please fill in all fields' }
    }

    try {
        await dbConnect()
        // Check if user exists
        const existing = await User.findOne({ email })
        if (existing) {
            return { error: 'Email already registered' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        await User.create({
            _id: id,
            name,
            email,
            password: hashedPassword,
            role,
            created_at: new Date()
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to create user:', error)
        return { error: `Failed to create user: ${(error as Error).message}` }
    }
}

export async function updateUser(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const password = formData.get('password') as string

    if (!id || !name || !email || !role) {
        return { error: 'Missing required fields' }
    }

    try {
        await dbConnect()
        // Check if email is taken by another user
        const existing = await User.findOne({ email, _id: { $ne: id } })
        if (existing) {
            return { error: 'Email already registered' }
        }

        const updateData: { name: string; email: string; role: string; password?: string } = { name, email, role }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        await User.findByIdAndUpdate(id, updateData)

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update user:', error)
        return { error: 'Failed to update user' }
    }
}

export async function deleteUser(id: string) {
    try {
        await dbConnect()
        await User.findByIdAndDelete(id)
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete user:', error)
        return { error: 'Failed to delete user' }
    }
}
