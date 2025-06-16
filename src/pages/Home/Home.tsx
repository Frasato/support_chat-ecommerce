import { useCallback, useEffect, useState } from "react";
import type { Chat } from "../../types/ChatsType";
import { listChats } from "../../services/getChats";
import ChatList from "../../components/openChats/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";
import "./home.scss";

const Home: React.FC = () => {
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('');

  const loadsChats = useCallback(async ()=>{
    try {
      
      const data = await listChats();
      setChats(data.chats);

    }catch(error){
      setChats([]);
      throw new Error(`Error on load chats: ${error}`);
    }
  }, []);

  useEffect(() => {
    loadsChats();
    const interval = setInterval(loadsChats, 30000);
    return () => clearInterval(interval);
  }, [loadsChats])
  
  const handleChatClose = () =>{
    setSelectedChatId(null);
    loadsChats();
  }

  return (
    <div className="chat-app-container">
      <ChatList
        chats={chats}
        selectedChatId={selectedChatId}
        onSelect={setSelectedChatId}
      />
      <ChatWindow chatId={selectedChatId} onChatClosed={handleChatClose}/>
    </div>
    );
  };
  
  export default Home;