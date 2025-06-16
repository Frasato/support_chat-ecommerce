import React, { useEffect, useRef, useState } from "react";
import type { ChatDto } from "../../types/ChatsType";
import { closeChat, connectToChat, disconnect, sendAdminMessage } from "../../services/websocket";
import { historyChat } from "../../services/getChats";
import "./chatWindowStyle.scss";

interface ChatWindowProps{
    chatId: string | null;
    onChatClosed: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({chatId, onChatClosed}) => {
    const [messages, setMessages] = useState<ChatDto[]>([]);
    const [input, setInput] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const userId: string | null = localStorage.getItem('userId');

    useEffect(()=> {
        if(!chatId){
            setMessages([]);
            setIsConnected(false);
            return;
        }

        setMessages([]);
        setIsConnected(false);

        historyChat(chatId)
            .then(history => setMessages(history))
            .catch(err => {
                setMessages([]);
                throw new Error(err)
            })

        connectToChat(chatId, (message: ChatDto) => {
            setMessages(prev => [...prev, message]);
            if(message.senderType === 'SYSTEM' && message.message === 'Chat encerrado'){
                onChatClosed();
            }
        })
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));

        return () => {
            disconnect();
            setIsConnected(false);
        }
    }, [chatId, onChatClosed]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleSend = () => {
        if(input.trim() && chatId && isConnected){
            console.log(`Conectado: ${isConnected} | input: ${input}`)
            sendAdminMessage(chatId, userId, input);
            setInput('');
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) =>{
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            handleSend()
        }
    }

    const handleCloseChat = () =>{
        if(chatId && isConnected){
            closeChat(chatId);
        }
    }

    return(
        <div className="chat-window">
            {!chatId ? (
                <div className="empty-state">
                <h3>Selecione um chat para responder</h3>
                </div>
            ) : (
                <>
                <div className="chat-header">
                    <h4>Chat: {chatId.substring(0, 8)}...</h4>
                    <button 
                    className="close-btn"
                    onClick={handleCloseChat}
                    disabled={!isConnected}
                    >
                    Encerrar Chat
                    </button>
                </div>
                
                <div className="messages-container">
                    {messages.length === 0 ? (
                    <div className="empty-state">
                        Nenhuma mensagem ainda.
                    </div>
                    ) : (
                    messages.map((msg, index) => (
                        <div 
                        key={index}
                        className={`message ${msg.senderType === 'ADMIN' ? 'admin' : 'user'}`}
                        >
                        <div className="message-content">
                            <div className="message-meta">
                            {msg.senderType} • {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                            <div className="message-text">{msg.message}</div>
                        </div>
                        </div>
                    ))
                    )}
                    <div ref={bottomRef} />
                </div>
                
                <div className="message-input-container">
                    <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!isConnected}
                    placeholder={isConnected ? "Digite sua mensagem..." : "Conectando..."}
                    />
                    <button
                    onClick={handleSend}
                    disabled={!isConnected || !input.trim()}
                    >
                    Enviar
                    </button>
                </div>
                </>
            )}
        </div>
    );
}

export default ChatWindow;