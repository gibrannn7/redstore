import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../app/axios';
import AdminLayout from '../../layouts/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminStoreList() {
    const queryClient = useQueryClient();
    const { data: stores, isLoading } = useQuery({
        queryKey: ['admin-stores'],
        queryFn: async () => {
            const response = await axios.get('/admin/stores');
            return response.data;
        }
    });

    const verifyMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.post(`/admin/stores/${id}/verify`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
            toast.success('Store verified');
        }
    });

    if (isLoading) return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
             <div className="max-w-7xl mx-auto px-4 py-8">
                 <h1 className="font-heading text-3xl font-bold mb-8">Store Management</h1>

                 <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                            <tr>
                                <th className="p-4">Store Name</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                             {stores?.data.map((store: any) => (
                                 <tr key={store.id}>
                                     <td className="p-4 font-medium">{store.name}</td>
                                     <td className="p-4">{store.user.name}</td>
                                     <td className="p-4">
                                         <span className={`px-2 py-1 rounded text-xs ${store.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                             {store.is_verified ? 'Verified' : 'Pending'}
                                         </span>
                                     </td>
                                     <td className="p-4 text-right">
                                         {!store.is_verified && (
                                             <button 
                                                onClick={() => verifyMutation.mutate(store.id)}
                                                className="text-blue-600 hover:underline"
                                             >
                                                 Verify
                                             </button>
                                         )}
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
