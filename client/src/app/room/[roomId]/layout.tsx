import { Metadata } from "next";
import { getRoomInfo } from "@/apis/repository/room.repository";
import { getToken } from "@/utils/getToken.utill";

interface Props {
    params: { roomId: string };
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const accessToken = getToken();
    const { data: roomData } = await getRoomInfo(params.roomId, accessToken);

    return {
        title: roomData?.room_name ?? `방 ${params.roomId}`,
        description: `${roomData?.room_name ?? `방 ${params.roomId}`}에서 실시간으로 소통하세요.`,
    };
};

const RoomLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default RoomLayout;
