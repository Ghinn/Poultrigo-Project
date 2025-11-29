'use client'

import { useState } from 'react'
import { addKandang, updateKandang } from '@/actions/kandang'
import { Home, Plus, Edit, X, Users, Calendar } from 'lucide-react'
import { useToast } from "@/components/ui/toast-provider"

export default function KandangClient({ kandang }: { kandang: any[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingKandang, setEditingKandang] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { showToast } = useToast()

    async function handleAdd(formData: FormData) {
        setIsLoading(true)
        const res = await addKandang(null, formData)
        setIsLoading(false)
        if (res?.error) showToast(res.error, "error")
        else {
            setIsAddOpen(false)
            showToast("Kandang berhasil ditambahkan!", "success")
        }
    }

    async function handleUpdate(formData: FormData) {
        setIsLoading(true)
        const res = await updateKandang(null, formData)
        setIsLoading(false)
        if (res?.error) showToast(res.error, "error")
        else {
            setEditingKandang(null)
            showToast("Kandang berhasil diperbarui!", "success")
        }
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kandang Management</h1>
                    <p className="text-slate-500">Monitor and update kandang status</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                >
                    <Plus className="h-4 w-4" />
                    Add Kandang
                </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {kandang.map((k) => (
                    <div key={k.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                        <div className="bg-slate-50 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                        <Home className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900">{k.name}</h3>
                                </div>
                                <button
                                    onClick={() => setEditingKandang(k)}
                                    className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-600"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <div className="text-xs text-slate-500">Population</div>
                                        <div className="font-bold text-slate-900">{k.population}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    <div>
                                        <div className="text-xs text-slate-500">Age (Days)</div>
                                        <div className="font-bold text-slate-900">{k.age}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Add New Kandang</h2>
                            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form action={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Kandang Name</label>
                                <input name="name" required placeholder="e.g. Kandang A" className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-orange-500" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button disabled={isLoading} className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                                    {isLoading ? 'Saving...' : 'Add Kandang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingKandang && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Update {editingKandang.name}</h2>
                            <button onClick={() => setEditingKandang(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form action={handleUpdate} className="space-y-4">
                            <input type="hidden" name="id" value={editingKandang.id} />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Population</label>
                                <input name="population" type="number" defaultValue={editingKandang.population} required className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Age (Days)</label>
                                <input name="age" type="number" defaultValue={editingKandang.age} required className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-orange-500" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditingKandang(null)} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button disabled={isLoading} className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                                    {isLoading ? 'Saving...' : 'Update Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
