import React from "react";
import style from "./roomGradientBackground.module.scss";
import RoomGradientItem from "./gradient/roomGradientItem";

interface Props {
    className?: string;
}

const roomGradientBackground = ({ className }: Props) => {
    return (
        <div className={`${style.background} ${className}`}>
            <RoomGradientItem />
            <RoomGradientItem />
            <RoomGradientItem />
            <RoomGradientItem />
            <RoomGradientItem />
        </div>
    );
};

export default roomGradientBackground;
