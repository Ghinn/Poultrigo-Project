'use server'

import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { redirect } from 'next/navigation'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret-key')

export async function login(prevState: { error?: string } | null, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Mohon isi semua kolom.' }
    }

    try {
        await dbConnect()
        const user = await User.findOne({ email })

        if (!user) {
            return { error: 'Email atau kata sandi salah.' }
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return { error: 'Email atau kata sandi salah.' }
        }

        // Update last login
        user.last_login = new Date()
        await user.save()

        const jwt = new jose.SignJWT({
            id: user.id, // This uses the _id (which is a string in our schema)
            email: user.email,
            role: user.role,
            name: user.name
        })

        jwt.setProtectedHeader({ alg: 'HS256' })
        jwt.setExpirationTime('24h')

        const token = await jwt.sign(SECRET)

        const cookieStore = await cookies()
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        })

        // Return user data instead of redirecting
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at ? new Date(user.created_at).toISOString() : new Date().toISOString(),
                last_login: user.last_login ? new Date(user.last_login).toISOString() : undefined
            }
        }

    } catch (err) {
        console.error('Login error:', err)
        return { error: `System error: ${(err as Error).message}` }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/')
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) return null

    try {
        const { payload } = await jose.jwtVerify(token, SECRET)
        return payload
    } catch {
        return null
    }
}
