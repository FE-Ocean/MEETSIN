import React from "react";
import Image from "next/image";
import useModal from "@/components/modal/hooks/useModal";
import LoginButton from "@/components/home/login/loginButton";
import { BaseModal } from "@/components/modal/baseModal/baseModal";
import { SOCIAL_LOGIN } from "@/constants/login.const";
import style from "./login.module.scss";

const Login = () => {
    const { onClose } = useModal("login");

    return (
        <BaseModal onClose={onClose}>
            <div className={style.login_modal}>
                <h2 className={style.title}>로그인</h2>
                <button className={style.close_button} onClick={onClose}>
                    <Image src={"/icons/close.svg"} alt="close button" width={24} height={24} />
                </button>
                <ul className={style.button_list}>
                    {Object.keys(SOCIAL_LOGIN).map((loginType) => {
                        return (
                            <li key={loginType}>
                                <LoginButton loginType={loginType} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </BaseModal>
    );
};

export default Login;
