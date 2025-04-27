import style from "./button.module.scss";
import Image from "next/image";

interface Props {
    type?: "button" | "submit";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    look: "solid" | "ghost";
    width?: number;
    text: string;
    bold?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    disabled?: boolean;
}

const Button = ({
    type = "button",
    onClick,
    look,
    width,
    text,
    bold,
    leftIcon,
    rightIcon,
    disabled,
}: Props) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${style.common} ${style[look]} ${bold && style.bold}`}
            disabled={disabled}
            style={{
                width: width ? `${width}px` : "auto",
            }}
        >
            {leftIcon && (
                <Image src={leftIcon} alt={text} width={18} height={18} className={style.icon} />
            )}
            {text}
            {rightIcon && (
                <Image src={rightIcon} alt={text} width={18} height={18} className={style.icon} />
            )}
        </button>
    );
};
export default Button;
