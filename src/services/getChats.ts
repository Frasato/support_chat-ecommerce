import type { ChatDto, ResponseListChatsDto } from "../types/ChatsType";

const apiUrl = import.meta.env.VITE_API_URL || '';
const token: string = localStorage.getItem('token') || '';

export async function listChats(): Promise<ResponseListChatsDto>{
    const response = await fetch(`${apiUrl}/chat`, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token
        },
    });

    if(!response.ok){
        throw new Error('Failed to list chats');
    }

    return response.json();
}

export async function historyChat(chatId: string): Promise<ChatDto[]>{
    const response = await fetch(`${apiUrl}/chat/${chatId}/messages`, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token
        }
    });

    if(!response.ok){
        throw new Error('Failed to get history chat');
    }

    const data: ChatDto[] = await response.json();
    return data;
}