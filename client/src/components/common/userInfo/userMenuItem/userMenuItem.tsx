import style from "./userMenuItem.module.scss";

interface Props {
    icon: React.ReactNode;
    label: string;
    onClick?: (...params: any) => any;
}

const UserMenuItem = (props: Props) => {
    const { icon, label, onClick } = props;

    return (
        <div className={style.wrapper} onClick={onClick}>
            {icon}
            <span className={style.label}>{label}</span>
        </div>
    );
};

export default UserMenuItem;
