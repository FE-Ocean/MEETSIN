"use client";

import { useState } from "react";
import style from "./linkCopyButton.module.scss";

interface Props {
    disabledTime?: number;
    className?: string;
}

const LinkCopyButton = (props: Props) => {
    const { disabledTime = 2000, className } = props;

    const [isCopied, setIsCopied] = useState(false);

    const handleLinkCopy = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), disabledTime);
        } catch (error) {
            console.error(error);
        }
    };

    const buttonStyle = isCopied ? style.link_after_copy : style.link_before_copy;

    return (
        <button
            className={`${className} ${buttonStyle}`}
            onClick={handleLinkCopy}
            disabled={isCopied}
        />
    );
};

export default LinkCopyButton;
