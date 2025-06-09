export const DIRECTION = {
    left: "left",
    right: "right",
    up: "up",
    down: "down",
} as const;

export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
export interface PlayerInfo {
    x: number;
    y: number;
    socketId: string;
    characterId: string;
    user: {
        userId: string;
        userName: string;
    };
}

export interface GameRoomInfo {
    players: {
        [key: string]: PlayerInfo;
    };
}

export interface SyncInfo {
    x: number;
    y: number;
    roomId: string;
    direction: Direction | null;
    socketId: string;
}

export interface MoveInfo {
    body: Phaser.Physics.Arcade.Body;
    sprite: Phaser.Physics.Arcade.Sprite;
    characterId: string;
    direction: Direction | null;
    velocityX: number;
    velocityY: number;
}

export interface CurrentPlayerType extends Phaser.Physics.Arcade.Sprite {
    moving?: boolean;
    socketId: string;
    characterId: string;
}

export interface OtherPlayerType extends Phaser.Physics.Arcade.Sprite {
    nameTag: Phaser.GameObjects.Text;
    socketId: string;
    characterId: string;
    moving?: boolean;
}

export interface PlayerContainerType extends Phaser.GameObjects.Container {
    playerSprite: Phaser.Physics.Arcade.Sprite;
    nameTag: Phaser.GameObjects.Text;
    socketId: string;
    characterId: string;
    moving: boolean;
}

export interface WASDKeys {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
}
