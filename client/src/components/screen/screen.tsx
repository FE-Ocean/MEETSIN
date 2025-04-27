import React, { useEffect, useRef } from "react";
import style from "./screen.module.scss";

interface Props {
    currentStream: MediaStream;
    userName: string;
}

const Screen = ({ currentStream, userName }: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (videoRef && videoRef.current && currentStream) {
            videoRef.current.srcObject = currentStream;
        }
    }, [videoRef, currentStream]);

    return (
        <div className={style.screen_container}>
            <video className={style.screen} autoPlay={true} ref={videoRef} />
            <span className={style.user_name}>{userName}</span>
        </div>
    );
};

export default Screen;
