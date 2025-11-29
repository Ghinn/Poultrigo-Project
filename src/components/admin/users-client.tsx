'use client'

import { useState } from 'react'
import { createUser, updateUser, deleteUser } from '@/actions/users'
import { Plus, Edit, Trash, X, Save, Search } from 'lucide-react'
import { useToast } from "@/components/ui/toast-provider"

export default function UsersClient({ users }: { users: any[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { showToast } = useToast()

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function handleAdd(formData: FormData) {
        setIsLoading(true)
        const res = await createUser(null, formData)
        setIsLoading(false)
        if (res?.error) showToast(res.error, "error")
        else {
            setIsAddOpen(false)
            showToast("User created successfully", "success")
        }
    }

    async function handleUpdate(formData: FormData) {
        setIsLoading(true)
        const res = await updateUser(null, formData)
        setIsLoading(false)
        if (res?.error) showToast(res.error, "error")
        else {
            setEditingUser(null)
            showToast("User updated successfully", "success")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this user?')) return
        const res = await deleteUser(id)
        if (res?.error) showToast(res.error, "error")
        else showToast("User deleted successfully", "success")
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage system access and roles</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Last Login</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-slate-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'operator' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form action={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                                <input name="name" required className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                                <input name="email" type="email" required className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                                <input name="password" type="password" required className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                                <select name="role" className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500">
                                    <option value="guest">Guest</option>
                                    <option value="operator">Operator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button disabled={isLoading} className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                                    {isLoading ? 'Saving...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form action={handleUpdate} className="space-y-4">
                            <input type="hidden" name="id" value={editingUser.id} />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                                <input name="name" defaultValue={editingUser.name} required className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                                <input name="email" type="email" defaultValue={editingUser.email} required className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Password (Leave blank to keep)</label>
                                <input name="password" type="password" className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                                <select name="role" defaultValue={editingUser.role} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500">
                                    <option value="guest">Guest</option>
                                    <option value="operator">Operator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                                <select name="status" defaultValue={editingUser.status} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-orange-500">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button disabled={isLoading} className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
