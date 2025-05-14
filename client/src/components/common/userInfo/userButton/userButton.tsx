import ProfileImage from "@/components/common/profileImage/profileImage";
import style from "./userButton.module.scss";

import { useGetUserInfo } from "@/apis/service/user.service";

interface Props {
    onClick?: () => void;
}

const UserInfoButton = (props: Props) => {
    const { onClick } = props;

    const { data: user } = useGetUserInfo();

    return (
        user && (
            <button className={style.user_info_button} onClick={onClick}>
                <ProfileImage src={user.profileImg} />
                <span className={style.user_name}>{user.userName}</span>
            </button>
        )
    );
};

export default UserInfoButton;
