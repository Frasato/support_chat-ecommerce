import type { ChatsType } from "../types/ChatsType";

export async function getChats(): Promise<ChatsType[]> {
    const apiUrl: string = import.meta.env.VITE_API_URL;
    
    try{
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.chats;
    }catch(error){
        console.error(error);
        return [];
    }
}