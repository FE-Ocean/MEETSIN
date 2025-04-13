export const SOCIAL_LOGIN: { [key: string]: string } = {
    google: "구글",
    // naver: "네이버",
    kakao: "카카오",
    guest: "게스트",
};

export type SOCIAL_LOGIN_TYPE = keyof typeof SOCIAL_LOGIN;
