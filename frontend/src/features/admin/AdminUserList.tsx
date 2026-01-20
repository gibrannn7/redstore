import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../app/axios';
import AdminLayout from '../../layouts/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminUserList() {
    const queryClient = useQueryClient();
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const response = await axios.get('/admin/users');
            return response.data; // paginated
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.post(`/admin/users/${id}/toggle-status`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('User status updated');
        }
    });

    if (isLoading) return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                 <h1 className="font-heading text-3xl font-bold mb-8">User Management</h1>

                 <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                             {users?.data.map((user: any) => (
                                 <tr key={user.id}>
                                     <td className="p-4 font-medium">{user.name}</td>
                                     <td className="p-4">{user.email}</td>
                                     <td className="p-4">
                                         {user.roles.map((r: any) => <span key={r.name} className="px-2 py-1 bg-gray-100 rounded text-xs mr-1">{r.name}</span>)}
                                     </td>
                                     <td className="p-4">
                                         <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                             {user.is_active ? 'Active' : 'Banned'}
                                         </span>
                                     </td>
                                     <td className="p-4 text-right">
                                         <button 
                                            onClick={() => toggleStatusMutation.mutate(user.id)}
                                            className="text-blue-600 hover:underline"
                                         >
                                             {user.is_active ? 'Ban' : 'Unban'}
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </AdminLayout>
    );
}
