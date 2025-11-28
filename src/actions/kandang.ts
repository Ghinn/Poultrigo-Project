'use server'

import { pool } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getKandang() {
    try {
        const [kandang] = await pool.execute('SELECT * FROM kandang ORDER BY name')
        return kandang
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function addKandang(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()
        const [result]: any = await connection.execute('INSERT INTO kandang (name) VALUES (?)', [name])
        const kandangId = result.insertId
        await connection.execute(
            'INSERT INTO kandang_history (kandang_id, action, population, age) VALUES (?, ?, ?, ?)',
            [kandangId, 'Created', 0, 0]
        )
        await connection.commit()
        revalidatePath('/operator/kandang')
        return { success: 'Kandang added successfully.' }
    } catch (err) {
        await connection.rollback()
        console.error(err)
        return { error: 'Error adding kandang.' }
    } finally {
        connection.release()
    }
}

export async function updateKandang(prevState: any, formData: FormData) {
    const id = formData.get('id') as string
    const population = formData.get('population') as string
    const age = formData.get('age') as string

    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()
        await connection.execute('UPDATE kandang SET population = ?, age = ? WHERE id = ?', [population, age, id])
        await connection.execute(
            'INSERT INTO kandang_history (kandang_id, action, population, age) VALUES (?, ?, ?, ?)',
            [id, 'Updated', population, age]
        )
        await connection.commit()
        revalidatePath('/operator/kandang')
        return { success: 'Kandang updated successfully.' }
    } catch (err) {
        await connection.rollback()
        console.error(err)
        return { error: 'Error updating kandang.' }
    } finally {
        connection.release()
    }
}
