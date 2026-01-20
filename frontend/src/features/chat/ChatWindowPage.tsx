import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../app/axios';
import { useEcho } from '../../hooks/useEcho';
import { useAuthStore } from '../../stores/useAuthStore';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface Message {
    id: number;
    body: string;
    sender_id: number;
    sender_type: string;
    created_at: string;
}

interface ChatData {
    conversation: {
        id: number;
        store: {
            id: number;
            name: string;
        }
    };
    messages: Message[];
}


export default function ChatWindowPage() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const echo = useEcho();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: chatData, isLoading } = useQuery({
        queryKey: ['chat', id],
        queryFn: async () => {
            const response = await axios.get<{ data: ChatData }>(`/chat/${id}`);
            return response.data.data;
        },
        enabled: !!id
    });

    // Realtime listener
    useEffect(() => {
        if (echo && id) {
            echo.private(`chat.${id}`)
                .listen('MessageSent', (e: { message: Message }) => {
                    queryClient.setQueryData(['chat', id], (old: ChatData | undefined) => {
                         if (!old) return old;
                         if (old.messages.find(m => m.id === e.message.id)) return old;
                         return {
                             ...old,
                             messages: [...old.messages, e.message]
                         };
                    });
                     scrollToBottom();
                });

            return () => {
                echo.leave(`chat.${id}`);
            };
        }
    }, [echo, id, queryClient]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatData?.messages]);

    const sendMessageMutation = useMutation({
        mutationFn: async (msg: string) => {
            await axios.post('/chat', {
                conversation_id: id,
                message: msg
            });
        },
        onSuccess: () => {
             setNewMessage('');
             queryClient.invalidateQueries({ queryKey: ['chat', id] });
        }
    });
    
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;
        sendMessageMutation.mutate(newMessage);
    }

    if (isLoading) return <MainLayout><div className="p-8 text-center">Loading...</div></MainLayout>;

    return (
        <MainLayout>
             <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col pt-8 pb-4 px-4">
                <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
                        <h2 className="font-bold">{chatData?.conversation.store.name || 'Chat'}</h2>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatData?.messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] p-3 rounded-lg ${
                                    msg.sender_id === user?.id 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                                }`}>
                                    <p>{msg.body}</p>
                                    <span className="text-xs opacity-75 mt-1 block">
                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Input */}
                    <form className="p-4 border-t" onSubmit={handleSend}>
                        <div className="flex gap-2">
                             <input 
                                className="flex-1 border rounded-lg px-4 py-2 dark:bg-dark-bg dark:border-dark-border"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                disabled={sendMessageMutation.isPending}
                             />
                             <Button type="submit" isLoading={sendMessageMutation.isPending}>Send</Button>
                        </div>
                    </form>
                </div>
             </div>
        </MainLayout>
    );
}

