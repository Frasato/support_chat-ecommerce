import Chat from "../../components/chat/Chat";
import OpenChats from "../../components/openChats/OpenChats";

const Home = () => {
    return(
        <section>
            <OpenChats />
            <Chat />
        </section>
    );
}

export default Home;