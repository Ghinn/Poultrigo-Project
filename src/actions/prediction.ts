'use server'

interface PredictionInput {
    age: number;
    gender: string;
    population: number;
    feedYesterday: number;
    leftover: number;
}

export async function predictFeed(data: PredictionInput) {
    const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'https://poultrigo-project-production-0bd4.up.railway.app';

    try {
        // Format data to match what the model likely expects
        // Note: The order of keys here MUST match the order of features used during training
        // Since we are using list(data.values()) in the python service
        const payload = {
            population: data.population,
            age: data.age,
            feedYesterday: data.feedYesterday,
            leftover: data.leftover,
            // Encode gender: Jantan = 1, Betina = 0
            gender: data.gender === 'Jantan' ? 1 : 0
        };

        const response = await fetch(`${ML_API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`ML Service Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.prediction;
    } catch (error) {
        console.error('Prediction Error:', error);
        throw error;
    }
}
