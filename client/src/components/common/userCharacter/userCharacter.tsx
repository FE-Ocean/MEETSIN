import React from "react";
import style from "./userCharacter.module.scss";

interface Props {
    characterId: number;
}

const UserCharacter = ({ characterId }: Props) => {
    return (
        <div
            className={style.character_icon}
            data-character={characterId}
            aria-label={`캐릭터 이미지 ${characterId}`}
        />
    );
};

export default UserCharacter;
