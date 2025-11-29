import { getKandang } from '@/actions/kandang'
import KandangClient from '@/components/operator/kandang-client'

export const dynamic = 'force-dynamic';

interface Kandang {
    id: string;
    name: string;
    population?: number;
    age?: number;
}

export default async function KandangPage() {
    let kandang: Kandang[] = [];
    try {
        kandang = await getKandang();
    } catch (error) {
        // Fallback if database connection fails during build
        console.error('Error loading kandang:', error);
    }
    return <KandangClient kandang={kandang} />
}
