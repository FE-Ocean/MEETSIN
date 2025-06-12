import LobbyHeader from "@/components/lobby/lobbyHeader/lobbyHeader";
import LobbyMain from "@/components/lobby/lobbyMain/lobbyMain";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "로비",
};

const Lobby = async () => {
    return (
        <>
            <LobbyHeader />
            <LobbyMain />
        </>
    );
};

export default Lobby;
