import React, { useEffect, useRef, useState } from "react";
import type { ChatDto } from "../../types/ChatsType";
import { closeChat, connectToChat, disconnect, sendAdminMessage } from "../../services/websocket";
import { historyChat } from "../../services/getChats";

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

    if(!chatId){
        return(
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9'
                }}>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    <h3>Selecione um chat para responder</h3>
                </div>
            </div>
        );
    }

    return(
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
            }}>
            <div style={{
                padding: 16,
                borderBottom: '1px solid #ccc',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h4 style={{ margin: 0 }}>Chat: {chatId.substring(0, 8)}...</h4>
                <button
                onClick={handleCloseChat}
                disabled={!isConnected}
                style={{
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    cursor: isConnected ? 'pointer' : 'not-allowed'
                }}
                >
                Encerrar Chat
                </button>
            </div>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                backgroundColor: '#f9f9f9'
            }}>
                {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: 50 }}>
                    Nenhuma mensagem ainda.
                </div>
                ) : (
                messages.map((msg, index) => (
                    <div
                    key={index}
                    style={{
                        marginBottom: 12,
                        display: 'flex',
                        justifyContent: msg.senderType === 'ADMIN' ? 'flex-end' : 'flex-start'
                    }}
                    >
                    <div style={{
                        maxWidth: '70%',
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: msg.senderType === 'ADMIN' ? '#2196f3' : '#fff',
                        color: msg.senderType === 'ADMIN' ? '#fff' : '#333',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '0.8em', opacity: 0.8, marginBottom: 4 }}>
                        {msg.senderType} • {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                        <div>{msg.message}</div>
                    </div>
                    </div>
                ))
                )}
                <div ref={bottomRef} />
            </div>
            <div style={{
                padding: 16,
                borderTop: '1px solid #ccc',
                backgroundColor: '#fff',
                display: 'flex',
                gap: 8
            }}>
                <input
                value={input}
                onChange={(e) => {console.log(e.target.value); setInput(e.target.value)}}
                onKeyDown={handleKeyPress}
                disabled={!isConnected}
                style={{
                    flex: 1,
                    padding: 12,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    fontSize: '1em'
                }}
                placeholder={isConnected ? "Digite sua mensagem..." : "Conectando..."}
                />
                <button
                onClick={handleSend}
                disabled={!isConnected || !input.trim()}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#2196f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: isConnected && input.trim() ? 'pointer' : 'not-allowed',
                    opacity: isConnected && input.trim() ? 1 : 0.5
                }}
                >
                Enviar
                </button>
            </div>
        </div>  
    );
}

export default ChatWindow;