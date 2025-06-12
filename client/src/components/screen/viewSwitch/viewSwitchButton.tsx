import React from "react";
import Button from "@/components/common/button/button";

interface Props {
    className: string;
    disabled: boolean;
    isMeetingView: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ViewSwitchButton = ({ className, disabled, isMeetingView, onClick }: Props) => {
    const buttonType = isMeetingView ? "ghost" : "solid";
    const icon = isMeetingView ? "/icons/chevron_left.svg" : "/icons/device_desktop.svg";
    const text = isMeetingView ? "돌아가기" : "화면 공유 보기";
    const buttonWidth = isMeetingView ? 110 : 142;
    return (
        <div className={className}>
            <Button
                text={text}
                leftIcon={icon}
                look={buttonType}
                disabled={disabled}
                onClick={onClick}
                width={buttonWidth}
            />
        </div>
    );
};

export default ViewSwitchButton;
