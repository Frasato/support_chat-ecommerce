export interface Chat{
    chatId: string;
    userId: string;
    active: boolean;
}

export interface ChatDto{
    chatId: string;
    userId: string | null;
    message: string;
    senderType: 'CLIENT' | 'ADMIN' | 'SYSTEM';
    active: boolean;
    timestamp: string;
}

export interface ResponseListChatsDto{
    chats: Chat[];
}