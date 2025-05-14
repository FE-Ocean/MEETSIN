import { DataConnection } from "peerjs";
import { User } from "./user.type";

export interface PeerData {
    user: User;
    stream: MediaStream | undefined;
    connection: DataConnection | undefined;
    peerId: string;
}

export const ScreenShareState = {
    SOMEONE_SHARING: "SOMEONE_SHARING",
    SELF_SHARING: "SELF_SHARING",
    NOT_SHARING: "NOT_SHARING",
} as const;
export type ScreenShareState = (typeof ScreenShareState)[keyof typeof ScreenShareState];
