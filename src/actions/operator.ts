'use server'

import dbConnect from '@/lib/mongodb'
import Kandang from '@/models/Kandang'
import KandangHistory from '@/models/KandangHistory'
import { revalidatePath } from 'next/cache'

// Types based on the models but adapted for frontend use
export interface KandangData {
    id: string;
    name: string;
    population: number;
    age: number;
    status: "Optimal" | "Peringatan" | "Kritis";
    createdAt: string;
    updatedAt: string;
}

export interface KandangHistoryData {
    id: string;
    kandangId: string;
    kandangName: string;
    action: "Created" | "Updated";
    population: number;
    age: number;
    timestamp: string;
}

export async function getKandangs(): Promise<KandangData[]> {
    try {
        await dbConnect();
        const kandangs = await Kandang.find({}).sort({ created_at: -1 }).lean();

        return kandangs.map((k: any) => ({
            id: k._id.toString(),
            name: k.name,
            population: k.population,
            age: k.age,
            status: "Optimal" as "Optimal" | "Peringatan" | "Kritis", // Default status as it's not in the schema yet, or calculate it
            createdAt: k.created_at?.toISOString() || new Date().toISOString(),
            updatedAt: k.created_at?.toISOString() || new Date().toISOString(),
        }));
    } catch (error) {
        console.error('Failed to fetch kandangs:', error);
        return [];
    }
}

export async function saveKandang(data: { name: string; population: number; age: number; status: string }): Promise<KandangData> {
    try {
        await dbConnect();

        const newKandang = await Kandang.create({
            name: data.name,
            population: data.population,
            age: data.age,
            // status is not in schema, ignoring for now or we should add it to schema
        });

        // Create History
        await KandangHistory.create({
            kandang_id: newKandang._id,
            action: "Created",
            population: data.population,
            age: data.age,
            created_at: new Date()
        });

        revalidatePath('/operator');

        return {
            id: newKandang._id.toString(),
            name: newKandang.name,
            population: newKandang.population,
            age: newKandang.age,
            status: "Optimal" as "Optimal" | "Peringatan" | "Kritis",
            createdAt: newKandang.created_at.toISOString(),
            updatedAt: newKandang.created_at.toISOString(),
        };
    } catch (error) {
        console.error('Failed to save kandang:', error);
        throw new Error('Failed to save kandang');
    }
}

export async function updateKandang(id: string, data: { name: string; population: number; age: number; status: string }): Promise<KandangData> {
    try {
        await dbConnect();

        const updatedKandang = await Kandang.findByIdAndUpdate(
            id,
            {
                name: data.name,
                population: data.population,
                age: data.age,
            },
            { new: true }
        );

        if (!updatedKandang) throw new Error('Kandang not found');

        // Create History
        await KandangHistory.create({
            kandang_id: updatedKandang._id,
            action: "Updated",
            population: data.population,
            age: data.age,
            created_at: new Date()
        });

        revalidatePath('/operator');

        return {
            id: updatedKandang._id.toString(),
            name: updatedKandang.name,
            population: updatedKandang.population,
            age: updatedKandang.age,
            status: "Optimal" as "Optimal" | "Peringatan" | "Kritis",
            createdAt: updatedKandang.created_at.toISOString(),
            updatedAt: updatedKandang.created_at.toISOString(), // Schema doesn't have updatedAt, using created_at or now
        };
    } catch (error) {
        console.error('Failed to update kandang:', error);
        throw new Error('Failed to update kandang');
    }
}

export async function deleteKandang(id: string): Promise<boolean> {
    try {
        await dbConnect();
        await Kandang.findByIdAndDelete(id);
        // Optionally delete history too
        await KandangHistory.deleteMany({ kandang_id: id });

        revalidatePath('/operator');
        return true;
    } catch (error) {
        console.error('Failed to delete kandang:', error);
        return false;
    }
}

export async function getKandangHistory(): Promise<KandangHistoryData[]> {
    try {
        await dbConnect();
        // Populate kandang to get the name
        const history = await KandangHistory.find({})
            .populate('kandang_id', 'name')
            .sort({ created_at: -1 })
            .lean();

        return history.map((h: any) => ({
            id: h._id.toString(),
            kandangId: h.kandang_id?._id?.toString() || 'deleted',
            kandangName: h.kandang_id?.name || 'Kandang Terhapus',
            action: h.action as "Created" | "Updated",
            population: h.population,
            age: h.age,
            timestamp: h.created_at?.toISOString() || new Date().toISOString(),
        }));
    } catch (error) {
        console.error('Failed to fetch history:', error);
        return [];
    }
}
