interface Keys {
    p256dh: string;
    auth: string;
}

export interface Subscription {
    endpoint: string;
    keys: Keys;
}
