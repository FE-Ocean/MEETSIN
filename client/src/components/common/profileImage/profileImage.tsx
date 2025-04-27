import React from "react";
import Image from "next/image";
import style from "./profileImage.module.scss";
import { IMAGE_SIZE_TYPE } from "@/constants/imageSize.const";

interface Props {
    src: string;
    alt?: string;
    size?: IMAGE_SIZE_TYPE;
}

const ProfileImage = ({ src, alt, size }: Props) => {
    if (!size) {
        size = IMAGE_SIZE_TYPE.middle;
    }
    // TODO: src = "" 이면 기본 이미지 추가
    return <Image src={src} alt={alt || ""} className={style.profile} width={size} height={size} />;
};

export default ProfileImage;
