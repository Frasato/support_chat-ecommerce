import type React from "react";
import type { Chat } from "../../types/ChatsType";

interface ChatListProps{
    chats: Chat[];
    selectedChatId: string | null;
    onSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({chats, selectedChatId, onSelect}) => {
    return(
        <div style={{
            width: 300,
            borderRight: '1px solid #ccc',
            height: '100vh',
            overflowY: 'auto',
            backgroundColor: '#f5f5f5'
            }}>
            <div style={{
                padding: 16,
                borderBottom: '1px solid #ccc',
                backgroundColor: '#fff',
                textAlign: 'center'
            }}>
                <h3 style={{ margin: 0 }}>Chats Ativos ({chats.length})</h3>
            </div>
            {chats.length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', color: '#666' }}>
                Nenhum chat ativo
                </div>
            ) : (
                chats.map(chat => (
                <div
                    key={chat.chatId}
                    onClick={() => onSelect(chat.chatId)}
                    style={{
                    padding: 16,
                    backgroundColor: chat.chatId === selectedChatId ? '#e3f2fd' : '#fff',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    Chat: {chat.chatId.substring(0, 8)}...
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Usuário: {chat.userId}
                    </div>
                </div>
                ))
            )}
        </div>
    );
}

export default ChatList;