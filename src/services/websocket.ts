import { Stomp, Client } from "@stomp/stompjs";
import type { ChatDto } from "../types/ChatsType";

const wsUrl = import.meta.env.VITE_WS_URL || '';
let stompClient: Client | null = null;

export function connectToChat(chatId: string, onMessage: (message: ChatDto) => void): Promise<void>{
    console.log('Entrou no connect chat')
    return new Promise((resolve, reject)=>{
        console.log('antes do new websocket')
        const client = Stomp.over(() => new WebSocket(wsUrl));

        client.debug = () => {};
        
        console.log('Antes do connect')
        client.connect({},
            () => {
                stompClient = client;
                client.subscribe(`/topic/chat/${chatId}`, (message) =>{
                    console.log(message.body);
                    const chatMessa: ChatDto = JSON.parse(message.body);
                    onMessage(chatMessa);
                });
                resolve();
            },
            (error: unknown) => {
                console.error(`Erro no websocket: ${error}`);
                reject(error);
            }
        )
    });
}

export function sendAdminMessage(chatId: string, userId: string | null, message: string): void {
    console.log(stompClient?.connected);
    if (stompClient && stompClient.connected) {
        const chatMessage: ChatDto = {
            chatId,
            userId,
            message,
            senderType: 'ADMIN',
            active: true,
            timestamp: new Date().toISOString()
        };

        console.log(chatMessage);
        
        stompClient.publish({destination: '/app/admin/chat', body: JSON.stringify(chatMessage)});
    }
}

export function closeChat(chatId: string): void {
    if (stompClient && stompClient.connected) {
        stompClient.publish({destination: '/app/admin/close', body: chatId});
    }
}

export function disconnect(): void {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        stompClient = null;
    }
}

export function subscribeToAllChats(onMessage: (message: ChatDto) => void): void {
    if (stompClient && stompClient.connected) {
        stompClient.subscribe('/topic/admin/chats', (message) => {
            const chatMessage: ChatDto = JSON.parse(message.body);
            onMessage(chatMessage);
        });
    }
}