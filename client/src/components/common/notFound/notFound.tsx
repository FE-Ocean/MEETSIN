"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/common/button/button";
import { NOT_FOUND_MESSAGES_TYPE } from "@/constants/notFound.const";
import style from "./notFound.module.scss";

interface Props {
    message: NOT_FOUND_MESSAGES_TYPE;
}

const NotFound = ({ message }: Props) => {
    const router = useRouter();

    return (
        <main className={style.main}>
            <div className={style.container}>
                <Image src="/favicon.ico" alt="MEETSIN 로고" width={90} height={90} />
                <strong className={style.strong}>{message}</strong>
                <div className={style.buttons}>
                    <Button
                        type="button"
                        onClick={() => router.push("/")}
                        look="ghost"
                        width={120}
                        text="MEETSIN 홈"
                        bold
                    />
                </div>
            </div>
        </main>
    );
};

export default NotFound;
