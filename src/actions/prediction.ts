'use server'

export async function predictFeed(prevState: any, formData: FormData) {
    const population = formData.get('population')
    const age = formData.get('age')
    const feed_given_yesterday = formData.get('feed_given_yesterday')
    const feed_leftover_yesterday = formData.get('feed_leftover_yesterday')

    if (!population || !age || !feed_given_yesterday || !feed_leftover_yesterday) {
        return { error: 'Mohon isi semua data' }
    }

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                population,
                age,
                feed_given_yesterday,
                feed_leftover_yesterday
            }),
        })

        if (!response.ok) {
            throw new Error('Gagal menghubungi layanan prediksi')
        }

        const result = await response.json()

        if (result.error) {
            return { error: result.error }
        }

        return {
            success: true,
            prediction: result.predicted_feed_kg
        }

    } catch (error: any) {
        console.error('Prediction error:', error)
        return { error: 'Gagal melakukan prediksi. Pastikan layanan ML berjalan.' }
    }
}
