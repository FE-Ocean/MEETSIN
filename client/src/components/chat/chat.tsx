"use client";

import style from "./chat.module.scss";
import MessageInput from "./messageInput/messageInput";
import MessageList from "./messageList/messageList";
import ScrollToBottom from "./scrollToBottom/scrollToBottom";
import { IMessage } from "@/types/chat.type";
import SummaryButton from "./summaryButton/summaryButton";

interface IChatProps {
    className: string;
    toggleChat: (shouldClose?: boolean) => void;
    messages: IMessage[];
    roomTitle: string;
}

const Chat = (props: IChatProps) => {
    const { className, toggleChat, roomTitle } = props;

    const messages = [
        {
            time: "2025-05-12T19:00:10.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "다들 오늘 스터디 준비는 잘해왔어?",
            nickname: "하준",
        },
        {
            time: "2025-05-12T19:00:24.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "나 코드 짜다가 막혔어ㅠㅠ React 상태 관리 부분 어려워",
            nickname: "민아",
        },
        {
            time: "2025-05-12T19:00:41.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "useContext 써봤어? 아니면 Redux로 해도 좋고",
            nickname: "지훈",
        },
        {
            time: "2025-05-12T19:01:03.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "Redux는 아직 안 써봤는데 배우기 어렵지 않아?",
            nickname: "민아",
        },
        {
            time: "2025-05-12T19:01:18.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "개념만 잡으면 쉬워! 오늘 같이 코드 보면서 설명해줄게",
            nickname: "지훈",
        },
        {
            time: "2025-05-12T19:01:35.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "지훈이 설명 잘하니까 믿고 들어봐ㅎㅎ",
            nickname: "하준",
        },
        {
            time: "2025-05-12T19:01:50.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "맞아ㅋㅋㅋ 지난번에도 지훈이 덕분에 TypeScript 이해했잖아",
            nickname: "소미",
        },
        {
            time: "2025-05-12T19:02:07.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "과찬이십니다ㅋㅋㅋ 그럼 민아 코드를 화면 공유해볼래?",
            nickname: "지훈",
        },
        {
            time: "2025-05-12T19:02:25.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "잠시만요~ 공유합니다!",
            nickname: "민아",
        },
        {
            time: "2025-05-12T19:02:43.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "흠, 여기 상태 업데이트 방식부터 바꾸면 좋을 것 같아",
            nickname: "지훈",
        },
        {
            time: "2025-05-12T19:03:01.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "아하~ 역시 내가 이상하게 하고 있었네ㅋㅋㅋ",
            nickname: "민아",
        },
        {
            time: "2025-05-12T19:03:15.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "그럼 나중에 리팩토링 연습할 수 있게 예제 코드도 좀 줘!",
            nickname: "소미",
        },
        {
            time: "2025-05-12T19:03:35.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "오키, 스터디 끝나면 GitHub에 올려줄게ㅋㅋ",
            nickname: "지훈",
        },
        {
            time: "2025-05-12T19:03:55.000Z",
            roomId: "c0d1n9s7u6d5y4r3o2m1",
            message: "고마워 지훈아~ 그럼 빨리 시작하자!",
            nickname: "하준",
        },
    ];

    return (
        <div className={`${className} ${style.chat_container}`}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>{roomTitle}</span>
                <button className={style.close_button} onClick={() => toggleChat(true)} />
            </div>
            <div className={style.chat_main}>
                <ScrollToBottom>
                    <MessageList messages={messages} />
                </ScrollToBottom>
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
                <SummaryButton messages={messages} />
            </div>
        </div>
    );
};

export default Chat;
