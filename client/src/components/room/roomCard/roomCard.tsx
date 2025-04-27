import Link from "next/link";
import { Room } from "@/types/room.type";
import { useSetAtom } from "jotai";
import { roomIdAtom } from "@/jotai/atom";
import useModal from "@/components/modal/hooks/useModal";
import style from "./roomCard.module.scss";

const ROOM_ACTION = {
    rename: "rename",
    delete: "delete",
} as const;

type ROOM_ACTION_TYPE = keyof typeof ROOM_ACTION;

const RoomCard = ({ room }: { room: Room }) => {
    const { id, roomName, createdAt } = room;
    const created = createdAt.slice(0, 10) + " 개설";

    const setRoomId = useSetAtom(roomIdAtom);
    const { onOpen: openRenameModal } = useModal("renameRoom");
    const { onOpen: openDeleteModal } = useModal("confirmDelete");

    const handleRoomAction = (action: ROOM_ACTION_TYPE, e: React.MouseEvent<HTMLButtonElement>) => {
        // e.stopPropagation();
        e.preventDefault();
        setRoomId(id);

        if (action === ROOM_ACTION.rename) openRenameModal();
        if (action === ROOM_ACTION.delete) openDeleteModal();
    };

    return (
        <Link href={`/room/${id}`}>
            <div className={style.container}>
                <div className={style.name_container}>
                    <p className={style.name}>{roomName}</p>
                </div>
                <span className={style.created_at}>{created}</span>
                <span className={style.button_container}>
                    <button
                        className={style.rename_button}
                        onClick={(e) => handleRoomAction(ROOM_ACTION.rename, e)}
                    />
                    <button
                        className={style.delete_button}
                        onClick={(e) => handleRoomAction(ROOM_ACTION.delete, e)}
                    />
                </span>
            </div>
        </Link>
    );
};
export default RoomCard;
