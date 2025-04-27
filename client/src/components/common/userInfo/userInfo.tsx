"use client";

import { useState } from "react";
import UserButton from "./userButton/userButton";
import UserMenu from "./userMenu/userMenu";
import style from "./userInfo.module.scss";

interface Props {
    direction?: "top" | "bottom";
    className?: string;
}

const UserInfo = (props: Props) => {
    const { direction = "top", className } = props;

    const [menuOpen, setMenuOpen] = useState(false);

    const handleUserButtonClick = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className={`${style.wrapper}${className && " " + className}`}>
            <UserButton onClick={handleUserButtonClick} />
            {menuOpen && <UserMenu className={`${style.user_menu} ${style[direction]}`} />}
        </div>
    );
};

export default UserInfo;
