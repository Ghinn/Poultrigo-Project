import { getKandang } from '@/actions/kandang'
import KandangClient from '@/components/operator/kandang-client'

export default async function KandangPage() {
    const kandang = await getKandang()
    return <KandangClient kandang={kandang} />
}
