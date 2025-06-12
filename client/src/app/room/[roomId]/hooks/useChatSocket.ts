import { useEffect, useState } from "react";
import { useGetUserInfo } from "@/apis/service/user.service";
import { roomSocket } from "@/socket";
import { RoomUser, Message } from "@/types/chat.type";
import { useAtomValue } from "jotai";
import { characterIdAtom } from "@/jotai/atom";

interface Params {
    roomId: string;
}

const useChatSocket = (params: Params) => {
    const { roomId } = params;
    const { data: user } = useGetUserInfo();
    const characterId = useAtomValue(characterIdAtom);

    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleNewMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    useEffect(() => {
        if (!user || !roomId) return;

        if (!roomSocket.connected) {
            roomSocket.connect();
        }

        const handleRoomUsers = (users: RoomUser[]) => {
            setRoomUsers(users);
        };

        roomSocket.emit("join_room", {
            roomId,
            userId: user.userId,
            userName: user.userName,
            characterId,
        });
        roomSocket.on("new_message", handleNewMessage);
        roomSocket.on("room_users", handleRoomUsers);

        return () => {
            roomSocket.emit("leave_room", { roomId, userId: user.userId });
            roomSocket.off("new_message");
            roomSocket.off("room_users");
            roomSocket.disconnect();
        };
    }, [roomId, user, characterId]);

    return { messages, roomUsers };
};

export default useChatSocket;
