'use server'

import { pool } from '@/lib/db'
import { User } from '@/utils/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
    try {
        const [rows]: any = await pool.execute('SELECT * FROM users ORDER BY created_at DESC')
        return rows as User[]
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return []
    }
}

export async function createUser(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    if (!name || !email || !password || !role) {
        return { error: 'Please fill in all fields' }
    }

    try {
        // Check if user exists
        const [existing]: any = await pool.execute('SELECT id FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            return { error: 'Email already registered' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        await pool.execute(
            'INSERT INTO users (id, name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [id, name, email, hashedPassword, role]
        )

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to create user:', error)
        return { error: `Failed to create user: ${(error as Error).message}` }
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const password = formData.get('password') as string

    if (!id || !name || !email || !role) {
        return { error: 'Missing required fields' }
    }

    try {
        // Check if email is taken by another user
        const [existing]: any = await pool.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, id])
        if (existing.length > 0) {
            return { error: 'Email already registered' }
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            await pool.execute(
                'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?',
                [name, email, role, hashedPassword, id]
            )
        } else {
            await pool.execute(
                'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
                [name, email, role, id]
            )
        }

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update user:', error)
        return { error: 'Failed to update user' }
    }
}

export async function deleteUser(id: string) {
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [id])
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete user:', error)
        return { error: 'Failed to delete user' }
    }
}
