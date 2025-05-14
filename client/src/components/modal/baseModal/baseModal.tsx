import { createPortal } from "react-dom";
import style from "./baseModal.module.scss";
import { MouseEventHandler } from "react";

interface Props {
    children: React.ReactNode;
    onClose: () => void;
}

export const BaseModal = (props: Props) => {
    const { children, onClose } = props;

    const body = document.body;

    if (!body) throw new Error("Cannnot Find Body");

    const handleInsideClick: MouseEventHandler<HTMLDivElement> = (event) => {
        event.stopPropagation();
    };

    const handleOutsideClick: MouseEventHandler<HTMLDivElement> = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {createPortal(
                <div className={style.modal_container} onClick={handleOutsideClick}>
                    <div className={style.modal_content_wrapper} onClick={handleInsideClick}>
                        {children}
                    </div>
                </div>,
                body,
            )}
        </>
    );
};
