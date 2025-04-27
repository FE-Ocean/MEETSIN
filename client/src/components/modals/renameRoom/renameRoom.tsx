import { useRef } from "react";
import { useAtomValue } from "jotai";
import { roomIdAtom } from "@/jotai/atom";
import { useGetRoomData, usePatchRoomData } from "@/apis/service/room.service";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import Button from "@/components/common/button/button";
import style from "./renameRoom.module.scss";

interface Props {
    onClose: () => void;
}

const RenameRoom = ({ onClose }: Props) => {
    const roomId = useAtomValue(roomIdAtom);
    const roomNameRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    const { data } = useGetRoomData(roomId);

    const { mutate } = usePatchRoomData(roomId);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ roomName: roomNameRef.current.value, roomId });
        onClose();
    };

    return (
        <BaseModal onClose={onClose}>
            <form onSubmit={handleSubmit} className={style.modal_container}>
                <button type="button" onClick={onClose} className={style.close_icon} />
                <h2 className={style.title}>방 이름 변경하기</h2>
                <input
                    type="text"
                    maxLength={20}
                    className={style.room_name}
                    ref={roomNameRef}
                    defaultValue={data?.roomName}
                    placeholder="방 이름을 입력하세요 (최대 20자)"
                />
                <div className={style.buttons}>
                    <Button
                        type="button"
                        onClick={onClose}
                        look="ghost"
                        width={100}
                        text="닫기"
                        bold
                    />
                    <Button type="submit" look="solid" width={100} text="변경하기" bold />
                </div>
            </form>
        </BaseModal>
    );
};
export default RenameRoom;
