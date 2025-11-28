'use server'

import { cookies } from 'next/headers'
import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { redirect } from 'next/navigation'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret-key')

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Please fill in all fields.' }
    }

    try {
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email])

        if (rows.length === 0) {
            return { error: 'Invalid email or password.' }
        }

        const user = rows[0]
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return { error: 'Invalid email or password.' }
        }

        // Update last login
        await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])

        const jwt = new jose.SignJWT({
            id: user.id,
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

    } catch (err) {
        console.error('Login error:', err)
        return { error: `System error: ${(err as Error).message}` }
    }

    // We need to redirect outside the try-catch block because redirect throws an error
    // Re-fetch user to get role for redirect (or use the one we have)
    const [rows]: any = await pool.execute('SELECT role FROM users WHERE email = ?', [email])
    const role = rows[0].role

    if (role === 'admin') redirect('/admin')
    else if (role === 'operator') redirect('/operator')
    else if (role === 'guest') redirect('/guest')
    else redirect('/')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/')
}
