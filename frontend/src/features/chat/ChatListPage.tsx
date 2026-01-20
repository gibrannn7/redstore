import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../app/axios';
import MainLayout from '../../layouts/MainLayout';
import { formatDate } from '../../utils/format';

interface Conversation {
    id: number;
    store: {
        id: number;
        name: string;
        avatar_url?: string;
    };
    last_message_at: string;
}

export default function ChatListPage() {
    const navigate = useNavigate();
    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const response = await axios.get<{ data: Conversation[] }>('/chat');
            return response.data.data;
        }
    });

    if (isLoading) return <MainLayout><div className="p-8 text-center">Loading...</div></MainLayout>;

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Messages</h1>
                
                <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                    {conversations?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No conversations yet</div>
                    ) : (
                        conversations?.map((conv) => (
                            <div 
                                key={conv.id} 
                                onClick={() => navigate(`/chat/${conv.id}`)}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-4 transition-colors"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                    {conv.store.avatar_url ? (
                                        <img src={conv.store.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium font-heading text-lg">{conv.store.name}</h3>
                                    <p className="text-sm text-gray-500">Last message: {formatDate(conv.last_message_at)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
