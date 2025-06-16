import type React from "react";
import type { Chat } from "../../types/ChatsType";
import "./chatListStyle.scss";

interface ChatListProps{
    chats: Chat[];
    selectedChatId: string | null;
    onSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({chats, selectedChatId, onSelect}) => {
    return(
        <div className="chat-list">
            <div className="list-header">
                <h3>Chats Ativos <span className="badge">{chats.length}</span></h3>
            </div>
            {chats.length === 0 ? (
                <div className="empty-state">
                    <span>Nenhum chat ativo</span>
                </div>
            ) : (
                chats.map(chat => (
                <div
                    key={chat.chatId}
                    onClick={() => onSelect(chat.chatId)}
                    className={`chat-item ${chat.chatId === selectedChatId ? 'selected' : ''}`}
                    >
                    <div className="chat-id">{chat.chatId.substring(0, 8)}...</div>
                    <div className="user-id">{chat.userId}</div>
                </div>
                ))
            )}
        </div>
    );
}

export default ChatList;