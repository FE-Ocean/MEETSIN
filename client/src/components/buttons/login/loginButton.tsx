"use client";

import React from "react";
import Image from "next/image";
import { SOCIAL_LOGIN, SOCIAL_LOGIN_TYPE } from "@/constants/login.const";
import style from "./loginButton.module.scss";

interface Props {
    loginType: SOCIAL_LOGIN_TYPE;
}

const LoginButton = ({ loginType }: Props) => {
    const login = async (loginType: SOCIAL_LOGIN_TYPE) => {
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/${loginType}`;
    };

    return (
        <button className={`${style.button} ${style[loginType]}`} onClick={() => login(loginType)}>
            <Image
                src={`/icons/login/${loginType}.svg`}
                className={style.icon}
                alt=""
                width="32"
                height="32"
            />
            <span className={style.text}>{SOCIAL_LOGIN[loginType]} 계정으로 로그인</span>
        </button>
    );
};

export default LoginButton;
