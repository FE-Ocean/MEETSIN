import { Scene } from "phaser";
import { Socket } from "socket.io-client";
import { PlayerManager } from "./managers/playerManager";
import { SocketManager } from "./managers/socketManager";
import { InputManager } from "./managers/inputManager";
import { ConfigManager } from "./managers/configManager";
import { MIN_ZOOM_LEVEL } from "@/constants/zoomLevel.const";
import { Direction, PlayerContainerType } from "@/types/phaser.type";

export class MeetsInPhaserScene extends Scene {
    public zoomLevel: number = MIN_ZOOM_LEVEL;

    public playerManager!: PlayerManager;
    public socketManager!: SocketManager;
    public inputManager!: InputManager;
    public configManager!: ConfigManager;

    public layerGround!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockOutdoor!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockIndoor!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockWall!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockFurniture!: Phaser.Tilemaps.TilemapLayer;

    public currentPlayer?: PlayerContainerType;
    public otherPlayers?: Phaser.Physics.Arcade.Group;

    private roomId: string;
    private socket: Socket;

    private readonly TILE_SIZE = 16;
    private readonly PLAYER_SPEED = 10;
    private readonly VELOCITY = this.PLAYER_SPEED * this.TILE_SIZE;

    private isChatFocused: boolean;

    constructor(roomId: string, socket: Socket) {
        super({ key: "MeetsInPhaserScene" });
        this.roomId = roomId;
        this.socket = socket;
        this.isChatFocused = false;
    }

    preload(): void {
        this.initLoad();
    }

    create(): void {
        // 매니저 초기화
        this.playerManager = new PlayerManager(this);
        this.socketManager = new SocketManager(this.socket, this, this.roomId);
        this.inputManager = new InputManager(this);
        this.configManager = new ConfigManager(this);

        // 소켓 이벤트 설정
        this.socketManager.setupSocketEvents();

        // 타일맵 설정
        this.configManager.setupMap();

        // 애니메이션 설정
        this.configManager.setupAnimations();

        this.otherPlayers = this.physics.add.group();
    }

    update(): void {
        if (this.isChatFocused) return;

        this.emitPlayerMovementState();
        this.updatePlayerMovementAndAnimation();
    }

    setIsChatFocused(isChatFocused: boolean): void {
        this.isChatFocused = isChatFocused;
    }

    setZoomLevel(zoomLevel: number): void {
        if (this.cameras.main) {
            this.cameras.main.setZoom(zoomLevel);
        }
    }

    private emitPlayerMovementState() {
        if (this.inputManager.isAnyCursorKeyDown()) {
            this.currentPlayer!.moving = true;
            this.socketManager.emitMove({
                x: this.currentPlayer?.x!,
                y: this.currentPlayer?.y!,
                roomId: this.roomId,
                direction: this.inputManager.getCurrentDirection(),
                playerId: this.currentPlayer?.playerId!,
            });
        }

        if (this.inputManager.isAllCursorKeyUp() && this.currentPlayer?.moving) {
            this.socketManager.emitStop({
                roomId: this.roomId,
            });
            this.currentPlayer!.moving = false;
        }
    }

    private updatePlayerMovementAndAnimation() {
        const direction = this.inputManager.getCurrentDirection();

        if (!this.currentPlayer) return;

        (this.currentPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        if (direction === "left") {
            this.movePlayerInDirection("left", -this.VELOCITY, 0);
            return;
        }

        if (direction === "right") {
            this.movePlayerInDirection("right", this.VELOCITY, 0);
            return;
        }

        if (direction === "down") {
            this.movePlayerInDirection("down", 0, this.VELOCITY);
            return;
        }

        if (direction === "up") {
            this.movePlayerInDirection("up", 0, -this.VELOCITY);
            return;
        }

        if (direction === null) {
            const playerSprite = this.currentPlayer?.playerSprite;

            // 현재 애니메이션 키 가져오기
            const currentAnim = playerSprite?.anims.currentAnim?.key.slice(5);
            const newAnim = `idle-${currentAnim}`;

            // 애니메이션 상태 확인 및 재생
            if (
                !playerSprite?.anims.isPlaying ||
                playerSprite?.anims.currentAnim?.key !== newAnim
            ) {
                playerSprite?.play(newAnim);
            }
        }
    }

    private movePlayerInDirection(
        direction: Direction,
        velocityX: number = 0,
        velocityY: number = 0,
    ) {
        if (!this.currentPlayer) return;

        const sprite = this.currentPlayer.playerSprite;
        const body = this.currentPlayer.body as Phaser.Physics.Arcade.Body;

        this.playerManager.movePlayer({
            sprite,
            body,
            characterId: this.currentPlayer?.characterId,
            direction,
            velocityX,
            velocityY,
        });
    }

    private initLoad(): void {
        this.load.image("base", "/map/base.png");
        this.load.image("indoor", "/map/indoor.png");
        this.load.image("urban", "/map/urban.png");
        this.load.tilemapTiledJSON("map", "/map/map.json");
        for (let i = 1; i <= 6; i++) {
            this.load.spritesheet(`player${i}`, `/players/player${i}.png`, {
                frameWidth: 16,
                frameHeight: 16,
            });
        }
    }
}
