import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import { roomSocket } from "@/socket";
import { numberToString } from "@/utils";
import Button from "@/components/common/button/button";
import style from "./timerSetting.module.scss";

interface Props {
    onClose: () => void;
}

const TimerSetting = ({ onClose }: Props) => {
    const { roomId } = useParams();

    const minRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const secRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    useEffect(() => {
        minRef.current.value = "25";
        secRef.current.value = "00";
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (minRef.current.value === "00" && secRef.current.value === "00") return;

        const minute = Number(minRef.current.value) || 0;
        const second = Number(secRef.current.value) || 0;

        roomSocket.emit("start_timer", { roomId, duration: { minute, second } });

        onClose();
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        targetRef: React.RefObject<HTMLInputElement>,
    ) => {
        targetRef.current!.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);

        const minute = Number(minRef.current.value);
        const second = Number(secRef.current.value);

        if (minute === 99 && second > 59) {
            secRef.current.value = "59";
        } else if (second > 59) {
            const remainingSeconds = second % 60;
            const overflowMinutes = Math.floor(second / 60);

            secRef.current.value = numberToString(remainingSeconds);
            minRef.current.value = numberToString(minute + overflowMinutes);
        }
    };

    const handleBlurInput = (
        e: React.FocusEvent<HTMLInputElement>,
        targetRef: React.RefObject<HTMLInputElement>,
    ) => {
        targetRef.current!.value = e.target.value.padStart(2, "0");
    };

    return (
        <BaseModal onClose={onClose}>
            <form onSubmit={handleSubmit} className={style.modal_container}>
                <button type="button" onClick={onClose} className={style.close_icon} />
                <h2 className={style.title}>타이머 설정하기</h2>
                <div className={style.time_section}>
                    <span className={style.placeholder}>88:88</span>
                    <div className={style.inputs}>
                        <input
                            type="text"
                            maxLength={2}
                            className={style.minute}
                            ref={minRef}
                            onChange={(e) => handleInput(e, minRef)}
                            onBlur={(e) => handleBlurInput(e, minRef)}
                        />
                        :
                        <input
                            type="text"
                            maxLength={2}
                            className={style.second}
                            ref={secRef}
                            onChange={(e) => handleInput(e, secRef)}
                            onBlur={(e) => handleBlurInput(e, secRef)}
                        />
                    </div>
                </div>
                <div className={style.buttons}>
                    <Button
                        type="button"
                        onClick={onClose}
                        look="ghost"
                        width={90}
                        text="닫기"
                        bold
                    />
                    <Button type="submit" look="solid" width={90} text="시작" bold />
                </div>
            </form>
        </BaseModal>
    );
};
export default TimerSetting;
