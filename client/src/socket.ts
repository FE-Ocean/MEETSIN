import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const roomSocket = io(`${URL}/room`, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling"],
});
