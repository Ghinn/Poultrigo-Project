'use client'

import { useState } from 'react'
import { predictFeed } from '@/actions/prediction'
import { Calculator, ArrowRight, Activity } from 'lucide-react'
import { useToast } from '@/components/ui/toast-provider'

export function FeedPrediction() {
    const [isLoading, setIsLoading] = useState(false)
    const [prediction, setPrediction] = useState<number | null>(null)
    const { showToast } = useToast()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setPrediction(null)

        const res = await predictFeed(null, formData)

        setIsLoading(false)

        if (res?.error) {
            showToast(res.error, "error")
        } else if (res?.prediction) {
            setPrediction(res.prediction)
            showToast("Prediksi berhasil dihitung!", "success")
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                        <Calculator className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#001B34]">Prediksi Pakan</h2>
                        <p className="text-sm text-slate-600">Hitung estimasi kebutuhan pakan harian menggunakan AI</p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Populasi Ayam (ekor)</label>
                                <input
                                    type="number"
                                    name="population"
                                    required
                                    min="1"
                                    placeholder="Contoh: 1500"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Umur Ayam (hari)</label>
                                <input
                                    type="number"
                                    name="age"
                                    required
                                    min="1"
                                    placeholder="Contoh: 25"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Pakan Diberikan Kemarin (kg)</label>
                                <input
                                    type="number"
                                    name="feed_given_yesterday"
                                    required
                                    min="0"
                                    step="0.1"
                                    placeholder="Contoh: 150.5"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Sisa Pakan Kemarin (kg)</label>
                                <input
                                    type="number"
                                    name="feed_leftover_yesterday"
                                    required
                                    min="0"
                                    step="0.1"
                                    placeholder="Contoh: 5.2"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Activity className="h-5 w-5 animate-spin" />
                                    Menghitung Prediksi...
                                </>
                            ) : (
                                <>
                                    <Calculator className="h-5 w-5" />
                                    Hitung Prediksi
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-6">
                        <h3 className="mb-4 text-center text-lg font-semibold text-slate-700">Hasil Prediksi</h3>

                        {prediction !== null ? (
                            <div className="text-center">
                                <div className="mb-2 text-sm text-slate-500">Estimasi Kebutuhan Pakan Hari Ini</div>
                                <div className="mb-4 text-5xl font-bold text-blue-600">
                                    {prediction} <span className="text-2xl text-slate-400">kg</span>
                                </div>
                                <div className="rounded-lg bg-blue-100 p-3 text-sm text-blue-700">
                                    Rekomendasi ini dibuat berdasarkan data historis dan pola pertumbuhan ayam.
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <div className="mb-4 rounded-full bg-slate-200 p-4">
                                    <ArrowRight className="h-8 w-8" />
                                </div>
                                <p className="text-center text-sm">
                                    Masukkan data di samping untuk melihat estimasi kebutuhan pakan.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
