import LobbyHeader from "@/components/lobby/lobbyHeader/lobbyHeader";
import LobbyMain from "@/components/lobby/lobbyMain/lobbyMain";
import { QUERY_KEY } from "@/constants/queryKey.const";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getToken } from "@/utils/getToken.utill";
import { formatRoomsData } from "../../apis/service/room.service";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "로비",
};

const Lobby = async () => {
    const queryClient = new QueryClient();

    const accessToken = getToken();

    await queryClient.prefetchQuery({
        queryKey: QUERY_KEY.rooms,
        queryFn: () => formatRoomsData(accessToken),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LobbyHeader />
            <LobbyMain />
        </HydrationBoundary>
    );
};

export default Lobby;
