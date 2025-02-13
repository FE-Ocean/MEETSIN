import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { IUser } from "@/types/user.type";
import { MIN_ZOOM_LEVEL } from "@/constants/zoomLevel.const";

interface PlayerInfo {
    x: number;
    y: number;
    playerId: string;
    characterId: string;
    user: {
        userId: string;
        userName: string;
    };
}

interface RoomInfo {
    players: {
        [key: string]: PlayerInfo;
    };
}

interface MoveInfo {
    x: number;
    y: number;
    playerId: string;
    direction: Direction;
}

type Direction = "left" | "right" | "up" | "down" | null;

const PLAYER_SPEED = 10;

type OtherPlayerType = Phaser.Physics.Arcade.Sprite & {
    nameTag: Phaser.GameObjects.Text;
    playerId: string;
    characterId: string;
    moving?: boolean;
};

type PlayerType = Phaser.Physics.Arcade.Sprite & {
    nameTag?: Phaser.GameObjects.Text;
    moving?: boolean;
    playerId?: string;
};

export class MeetsInPhaserScene extends Phaser.Scene {
    private user: IUser;
    private roomId: string;
    private socket: Socket;
    private otherPlayers: Phaser.Physics.Arcade.Group | null;
    private myCharacterId: string | null;
    private isChatFocused: boolean;
    private zoomLevel: number;
    private player!: Phaser.Physics.Arcade.Sprite & {
        nameTag?: Phaser.GameObjects.Text;
        moving?: boolean;
        playerId?: string;
    };
    private layerBlockOutdoor!: Phaser.Tilemaps.TilemapLayer;
    private layerBlockWall!: Phaser.Tilemaps.TilemapLayer;
    private layerBlockFurniture!: Phaser.Tilemaps.TilemapLayer;
    private keyboardInput!: Phaser.Types.Input.Keyboard.CursorKeys;
    private etcKeyboardInput: object | undefined;

    constructor(roomId: string, user: IUser, socket: Socket) {
        super("MeetsInPhaserScene");
        this.user = user;
        this.roomId = roomId;
        this.socket = socket;
        this.otherPlayers = null;
        this.myCharacterId = null;
        this.isChatFocused = false;
        this.zoomLevel = MIN_ZOOM_LEVEL;
    }

    setIsChatFocused(isChatFocused: boolean): void {
        this.isChatFocused = isChatFocused;
    }

    setZoomLevel(zoomLevel: number): void {
        if (this.cameras.main) {
            this.cameras.main.setZoom(zoomLevel);
        }
    }

    preload(): void {
        this.load.image("base", "/map/base.png");
        this.load.image("indoor", "/map/indoor.png");
        this.load.image("urban", "/map/urban.png");
        this.load.tilemapTiledJSON("map", "/map/map.json");
        for (let i = 1; i <= 6; i++) {
            this.load.spritesheet(`player${i}`, `/players/player${i}.png`, {
                frameWidth: 32,
                frameHeight: 32,
            });
        }
    }

    create(): void {
        const map = this.make.tilemap({ key: "map" });
        const tileBase = map.addTilesetImage("base", "base")!;
        const tileIndoor = map.addTilesetImage("indoor", "indoor")!;
        const tileUrban = map.addTilesetImage("urban", "urban")!;

        map.createLayer("ground", [tileBase, tileUrban], 0, 0);
        this.layerBlockOutdoor = map.createLayer(
            "block-outdoor",
            [tileBase, tileUrban],
            0,
            0,
        )!;
        this.layerBlockWall = map.createLayer("block-wall", [tileBase, tileUrban], 0, 0)!;
        this.layerBlockFurniture = map.createLayer(
            "block-furniture",
            [tileBase, tileIndoor],
            0,
            0,
        )!;
        map.createLayer("furniture", [tileBase, tileIndoor, tileUrban], 0, 0);
        const layerChairBack = map.createLayer("chair-back", [tileBase, tileIndoor], 0, 0);
        map.createLayer("top-decorations", [tileBase, tileUrban], 0, 0);

        layerChairBack!.setDepth(2);

        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.scrollX = -map.widthInPixels / 2;
        this.cameras.main.scrollY = -map.heightInPixels / 2;

        this.layerBlockOutdoor.setCollisionByExclusion([-1]);
        this.layerBlockWall.setCollisionByExclusion([-1]);
        this.layerBlockFurniture.setCollisionByExclusion([-1]);

        this.otherPlayers = this.physics.add.group();

        this.setupSocket();
        this.setupAnimations();

        this.keyboardInput = this.input.keyboard!.createCursorKeys();
        this.etcKeyboardInput = this.input.keyboard!.addKeys("W,A,S,D");
        this.input.keyboard!.disableGlobalCapture();
    }

    update(): void {
        if (this.player) this.handlePlayerMovement(this.player);
        this.updateNameTags();
    }

    private setupSocket(): void {
        this.socket.emit("join_phaser_room", this.roomId);
        this.socket.on("roomInfo", (roomInfo: RoomInfo) => this.handleRoomInfo(roomInfo));
        this.socket.on("newPlayer", ({ playerInfo }: { playerInfo: PlayerInfo }) =>
            this.addOtherPlayers(playerInfo),
        );
        this.socket.on("move", (info: MoveInfo) => this.moveOtherPlayer(info));
        this.socket.on("stop", (info: { playerId: string }) => this.stopOtherPlayer(info));
        this.socket.on("userDisconnected", (info: { user: { userId: string } }) =>
            this.removePlayer(info.user.userId),
        );
    }

    private handleRoomInfo(roomInfo: RoomInfo): void {
        const { players } = roomInfo;
        Object.entries(players).forEach(([id, playerInfo]) => {
            id === this.socket.id ? this.addPlayer(playerInfo) : this.addOtherPlayers(playerInfo);
        });
    }

    private setupAnimations(): void {
        for (let i = 1; i <= 6; i++) {
            const spriteKey = `player${i}`;

            this.anims.create({
                key: `walk-left-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [0, 4, 8] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk-right-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [3, 7, 11] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk-up-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [2, 6, 10] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `walk-down-${i}`,
                frames: this.anims.generateFrameNumbers(spriteKey, { frames: [1, 5, 9] }),
                frameRate: 10,
                repeat: -1,
            });

            this.anims.create({
                key: `idle-left-${i}`,
                frames: [{ key: spriteKey, frame: 0 }],
                frameRate: 1,
            });

            this.anims.create({
                key: `idle-right-${i}`,
                frames: [{ key: spriteKey, frame: 3 }],
                frameRate: 1,
            });

            this.anims.create({
                key: `idle-up-${i}`,
                frames: [{ key: spriteKey, frame: 2 }],
                frameRate: 1,
            });

            this.anims.create({
                key: `idle-down-${i}`,
                frames: [{ key: spriteKey, frame: 1 }],
                frameRate: 1,
            });
        }
    }

    private handlePlayerMovement(
        player: Phaser.Physics.Arcade.Sprite & { moving?: boolean },
    ): void {
        if (this.isChatFocused) return;

        player.setVelocity(0);
        if (this.isAnyCursorKeyDown()) {
            player.moving = true;
            this.emitPlayerMovement(player, this.getCurrentDirection());
        }
        if (this.isAllCursorKeyUp() && player.moving) {
            this.emitStopMovement();
            player.moving = false;
        }

        if (this.keyboardInput.left.isDown || this.etcKeyboardInput?.A.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim?.key !== `walk-left-${this.myCharacterId}`
            ) {
                player.play(`walk-left-${this.myCharacterId}`);
            }
            player.setVelocityX(-PLAYER_SPEED * 16);
        } else if (this.keyboardInput.right.isDown || this.etcKeyboardInput?.D.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim?.key !== `walk-right-${this.myCharacterId}`
            ) {
                player.play(`walk-right-${this.myCharacterId}`);
            }
            player.setVelocityX(PLAYER_SPEED * 16);
        } else if (this.keyboardInput.up.isDown || this.etcKeyboardInput?.W.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim?.key !== `walk-up-${this.myCharacterId}`
            ) {
                player.play(`walk-up-${this.myCharacterId}`);
            }
            player.setVelocityY(-PLAYER_SPEED * 16);
        } else if (this.keyboardInput.down.isDown || this.etcKeyboardInput?.S.isDown) {
            if (
                !player.anims.isPlaying ||
                player.anims.currentAnim?.key !== `walk-down-${this.myCharacterId}`
            ) {
                player.play(`walk-down-${this.myCharacterId}`);
            }
            player.setVelocityY(PLAYER_SPEED * 16);
        } else {
            const currentAnim = this.player.anims.currentAnim?.key.slice(5);
            const newAnim = `idle-${currentAnim}`;

            if (!this.player.anims.isPlaying || this.player.anims.currentAnim?.key !== newAnim) {
                this.player.play(newAnim);
            }
        }
    }

    private getCurrentDirection(): Direction {
        if (this.keyboardInput.left.isDown || this.etcKeyboardInput?.A.isDown) {
            return "left";
        }

        if (this.keyboardInput.right.isDown || this.etcKeyboardInput?.D.isDown) {
            return "right";
        }

        if (this.keyboardInput.up.isDown || this.etcKeyboardInput?.W.isDown) {
            return "up";
        }

        if (this.keyboardInput.down.isDown || this.etcKeyboardInput?.S.isDown) {
            return "down";
        }
        return null;
    }

    private isAnyCursorKeyDown(): boolean {
        return (
            this.keyboardInput.left.isDown ||
            this.keyboardInput.right.isDown ||
            this.keyboardInput.up.isDown ||
            this.keyboardInput.down.isDown ||
            this.etcKeyboardInput?.W.isDown ||
            this.etcKeyboardInput?.A.isDown ||
            this.etcKeyboardInput?.S.isDown ||
            this.etcKeyboardInput?.D.isDown
        );
    }

    private isAllCursorKeyUp(): boolean {
        return (
            this.keyboardInput.left.isUp &&
            this.keyboardInput.right.isUp &&
            this.keyboardInput.up.isUp &&
            this.keyboardInput.down.isUp &&
            this.etcKeyboardInput?.W.isUp &&
            this.etcKeyboardInput?.A.isUp &&
            this.etcKeyboardInput?.S.isUp &&
            this.etcKeyboardInput?.D.isUp
        );
    }

    private emitPlayerMovement(player: Phaser.Physics.Arcade.Sprite, direction: Direction): void {
        if (!player || !this.socket) return;
        this.socket.emit("move", {
            x: player.x,
            y: player.y,
            roomId: this.roomId,
            direction,
        });
    }

    private emitStopMovement(): void {
        if (!this.socket) return;
        this.socket.emit("stop", { playerId: this.player.playerId, roomId: this.roomId });
    }

    private updateNameTags(): void {
        if (!this.otherPlayers) return;

        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            const player = otherPlayer as OtherPlayerType;
            player.nameTag.x = player.x + player.displayWidth / 2;
            player.nameTag.y = player.y - 15;
        });

        if (this.player && this.player.nameTag) {
            this.player.nameTag.x = this.player.x + this.player.displayWidth / 2;
            this.player.nameTag.y = this.player.y - 15;
        }
    }

    private moveOtherPlayer(info: MoveInfo): void {
        if (!this.otherPlayers) return;

        (this.otherPlayers.getChildren() as OtherPlayerType[]).forEach((otherPlayer) => {
            if (info.playerId === otherPlayer.playerId) {
                this.animateOtherPlayerMovement(otherPlayer, info);
            }
        });
    }

    private stopOtherPlayer(info: { playerId: string }): void {
        if (!this.otherPlayers) return;

        (this.otherPlayers.getChildren() as OtherPlayerType[]).forEach((otherPlayer) => {
            if (info.playerId === otherPlayer.playerId) {
                this.animateOtherPlayerStop(otherPlayer);
            }
        });
    }

    private animateOtherPlayerMovement(otherPlayer: OtherPlayerType, info: MoveInfo): void {
        const direction = info.direction;
        const animationKey = `walk-${direction}-${otherPlayer.characterId}`;

        if (!otherPlayer.anims.isPlaying || otherPlayer.anims.currentAnim?.key !== animationKey) {
            otherPlayer.play(animationKey);
        }

        otherPlayer.moving = true;
        otherPlayer.setPosition(info.x, info.y);
    }

    private animateOtherPlayerStop(otherPlayer: OtherPlayerType): void {
        const stopAnim = otherPlayer.anims.currentAnim?.key.slice(5);

        if (otherPlayer.moving) {
            otherPlayer.play(`idle-${stopAnim}`);
        }
        otherPlayer.moving = false;
    }

    private addPlayer(playerInfo: PlayerInfo): void {
        this.myCharacterId = playerInfo.characterId;
        const spriteKey = `player${playerInfo.characterId}`;

        const player = this.physics.add.sprite(playerInfo.x, playerInfo.y, spriteKey) as PlayerType;
        player.setCollideWorldBounds(true);
        player.anims.play(`idle-down-${this.myCharacterId}`);
        player.setOrigin(0, 0);
        player.setSize(16, 16);
        player.setDisplaySize(16, 16);

        this.physics.add.collider(player, this.layerBlockOutdoor);
        this.physics.add.collider(player, this.layerBlockWall);
        this.physics.add.collider(player, this.layerBlockFurniture);

        this.cameras.main.startFollow(player);
        this.setZoomLevel(this.zoomLevel);
        this.cameras.main.setRoundPixels(true);

        player.nameTag = this.createNameTag(
            playerInfo.x + player.width / 2,
            playerInfo.y - 15,
            playerInfo.user.userName,
        );
        this.player = player;
        this.player.moving = false;
    }

    private addOtherPlayers(playerInfo: PlayerInfo): void {
        if (!this.otherPlayers) return;

        const spriteKey = `player${playerInfo.characterId}`;

        const otherPlayer = this.physics.add.sprite(
            playerInfo.x,
            playerInfo.y,
            spriteKey,
        ) as OtherPlayerType;

        otherPlayer.setCollideWorldBounds(true);
        otherPlayer.anims.play(`idle-down-${playerInfo.characterId}`);
        otherPlayer.setOrigin(0, 0);
        otherPlayer.setSize(16, 16);
        otherPlayer.setDisplaySize(16, 16);
        otherPlayer.playerId = playerInfo.playerId;
        otherPlayer.characterId = playerInfo.characterId;
        otherPlayer.nameTag = this.createNameTag(
            playerInfo.x + otherPlayer.width / 2,
            playerInfo.y - 15,
            playerInfo.user.userName,
        );
        this.otherPlayers.add(otherPlayer);
    }

    private createNameTag(x: number, y: number, text: string): Phaser.GameObjects.Text {
        const nameTag = this.add
            .text(x, y, text, {
                fontFamily: "Noto Sans KR",
                fontSize: "7px",
                color: "#ffffff",
                padding: { x: 2, y: 2 },
                resolution: 2,
            })
            .setOrigin(0.5);

        nameTag.setBackgroundColor("#000000");
        nameTag.alpha = 0.6;

        return nameTag;
    }

    private removePlayer(playerId: string): void {
        if (!this.otherPlayers) return;

        (this.otherPlayers.getChildren() as OtherPlayerType[]).forEach((otherPlayer) => {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.nameTag.destroy();
                otherPlayer.destroy();
            }
        });
    }
}
