export const NOT_FOUND_MESSAGES = {
    global: "존재하지 않는 페이지입니다",
    room: "삭제되었거나 존재하지 않는 방입니다",
} as const;

export type NOT_FOUND_MESSAGES_TYPE = (typeof NOT_FOUND_MESSAGES)[keyof typeof NOT_FOUND_MESSAGES];
