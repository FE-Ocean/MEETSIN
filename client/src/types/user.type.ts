import { Subscription } from "./subscription.type";

// 뷰 모델
export interface User {
    userId: string;
    userName: string;
    profileImg: string;
    email: string;
    notification?: Subscription[];
}

// 서버의 응답 모델
export interface UserModel {
    // user_id: string
    _id: string;
    user_name: string;
    profile_img: string;
    email: string;
    notification?: Subscription[];
}
