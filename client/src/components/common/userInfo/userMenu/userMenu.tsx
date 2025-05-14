import Image from "next/image";
import UserMenuItem from "../userMenuItem/userMenuItem";
import style from "./userMenu.module.scss";
import { useRouter } from "next/navigation";
import { useLogout } from "@/apis/service/user.service";

interface Props {
    className?: string;
}

const UserMenu = (props: Props) => {
    const router = useRouter();
    const { mutate } = useLogout();
    const logout = () => {
        mutate(undefined, {
            onSettled: () => {
                router.push("/");
            },
        });
    };

    const USER_MENU = [
        {
            icon: <Image width={24} height={24} src="/icons/setting.svg" alt="환경설정 아이콘" />,
            label: "환경설정",
        },
        {
            icon: <Image width={24} height={24} src="/icons/door_exit.svg" alt="로그아웃 아이콘" />,
            label: "로그아웃",
            onClick: logout,
        },
    ];

    const { className } = props;

    return (
        <div className={`${style.wrapper} ${className}`}>
            {USER_MENU.map((menu, index) => (
                <UserMenuItem
                    key={index}
                    icon={menu.icon}
                    label={menu.label}
                    onClick={menu.onClick}
                />
            ))}
        </div>
    );
};

export default UserMenu;
