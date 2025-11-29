'use server'

import dbConnect from '@/lib/mongodb'
import Kandang from '@/models/Kandang'
import KandangHistory from '@/models/KandangHistory'
import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'

export async function getKandang() {
    try {
        await dbConnect()
        const kandang = await Kandang.find({}).sort({ name: 1 }).lean()
        // Map _id to id if needed.
        return kandang.map((k: any) => ({ ...k, id: k._id.toString() }))
    } catch (err) {
        console.error(err)
        return []
    }
}

export async function addKandang(prevState: any, formData: FormData) {
    const name = formData.get('name') as string

    try {
        await dbConnect()

        const newKandang = await Kandang.create({
            name,
            population: 0,
            age: 0
        })

        await KandangHistory.create({
            kandang_id: newKandang._id,
            action: 'Created',
            population: 0,
            age: 0
        })

        revalidatePath('/operator/kandang')
        return { success: 'Kandang added successfully.' }
    } catch (err) {
        console.error(err)
        return { error: 'Error adding kandang.' }
    }
}

export async function updateKandang(prevState: any, formData: FormData) {
    const id = formData.get('id') as string
    const population = parseInt(formData.get('population') as string)
    const age = parseInt(formData.get('age') as string)

    try {
        await dbConnect()

        await Kandang.findByIdAndUpdate(id, { population, age })

        await KandangHistory.create({
            kandang_id: id,
            action: 'Updated',
            population,
            age
        })

        revalidatePath('/operator/kandang')
        return { success: 'Kandang updated successfully.' }
    } catch (err) {
        console.error(err)
        return { error: 'Error updating kandang.' }
    }
}
