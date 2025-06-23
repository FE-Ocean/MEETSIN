export const QUERY_KEY = {
    user: ["auth", "user", "info"],
    rooms: ["rooms"],
    room: (roomId?: string) => {
        const baseKey = ["room"];
        if (roomId) {
            return baseKey.concat(roomId);
        }
        return baseKey;
    },
    subscription: ["subscription"],
};
