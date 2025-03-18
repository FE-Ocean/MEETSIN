"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/common/button/button";
import style from "./not-found.module.scss";

const NotFound = () => {
    const router = useRouter();

    return (
        <main className={style.main}>
            <div className={style.container}>
                <Image src="/favicon.ico" alt="MEETSIN 로고" width={90} height={90} />
                <strong className={style.strong}>삭제되었거나 존재하지 않는 방입니다</strong>
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
