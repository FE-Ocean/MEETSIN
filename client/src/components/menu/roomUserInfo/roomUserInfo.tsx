"use client";

import { useParams } from "next/navigation";
import style from "./roomUserInfo.module.scss";
import { RoomUser } from "@/types/chat.type";
import { useGetRoomData } from "@/apis/service/room.service";

interface Props {
    roomUsers: RoomUser[];
}

const RoomUserInfo = ({ roomUsers }: Props) => {
    const params = useParams();
    const roomId = params.roomId as string;
    const { data: roomInfo } = useGetRoomData(roomId);

    return (
        <div className={style.room_user_info_container}>
            <ul>
                {roomUsers.map((user) => (
                    <li key={user.userId} className={style.room_user_info_item}>
                        <div className={style.avatar} />
                        <span>{user.userName}</span>
                    </li>
                ))}
            </ul>
            <div className={style.separator} />
            <span className={style.room_name}>{roomInfo?.roomName}</span>
        </div>
    );
};

export default RoomUserInfo;
