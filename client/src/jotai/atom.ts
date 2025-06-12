import { atom } from "jotai";
import { ScreenShareState } from "@/types/peer.type";
import { MIN_ZOOM_LEVEL } from "@/constants/zoomLevel.const";

interface ModalAtom {
    [fileName: string]: {
        open: boolean;
    };
}

export const modalAtom = atom<ModalAtom>({
    login: {
        open: false,
    },
});

export const timerAtom = atom({
    minute: 0,
    second: 0,
});

export const isTimerVisibleAtom = atom(false);

export const screenShareStateAtom = atom<ScreenShareState>(ScreenShareState.NOT_SHARING);

export const roomIdAtom = atom("");

export const isChatFocusedAtom = atom(false);

export const zoomLevelAtom = atom(MIN_ZOOM_LEVEL);

export const accessTokenAtom = atom<string | null>(null);

export const characterIdAtom = atom<number>();
