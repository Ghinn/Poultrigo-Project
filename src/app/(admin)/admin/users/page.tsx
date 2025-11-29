import { getUsers } from '@/actions/users'
import UsersClient from '@/components/admin/users-client'

export const dynamic = 'force-dynamic';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    last_login?: Date | string;
}

export default async function UsersPage() {
    let users: User[] = [];
    try {
        users = await getUsers();
    } catch (error) {
        // Fallback if database connection fails during build
        console.error('Error loading users:', error);
    }
    return <UsersClient users={users} />
}
