import { Scene } from "phaser";
import { Socket } from "socket.io-client";
import { PlayerManager } from "./managers/playerManager";
import { SocketManager } from "./managers/socketManager";
import { InputManager } from "./managers/inputManager";
import { ConfigManager } from "./managers/configManager";
import { MIN_ZOOM_LEVEL } from "@/constants/zoomLevel.const";
import { DIRECTION, Direction, PlayerContainerType } from "@/types/phaser.type";

export class MeetsInPhaserScene extends Scene {
    public zoomLevel: number = MIN_ZOOM_LEVEL;

    public playerManager!: PlayerManager;
    public socketManager!: SocketManager;
    public inputManager!: InputManager;
    public configManager!: ConfigManager;

    public layerBlockOutdoor!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockIndoor!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockWall!: Phaser.Tilemaps.TilemapLayer;
    public layerBlockFurniture!: Phaser.Tilemaps.TilemapLayer;

    public currentPlayer?: PlayerContainerType;
    public otherPlayers?: Phaser.Physics.Arcade.Group;

    private roomId: string;
    private socket: Socket;

    private isChatFocused: boolean;

    private readonly TILE_SIZE = 16;
    private readonly PLAYER_SPEED = 10;
    private readonly VELOCITY = this.PLAYER_SPEED * this.TILE_SIZE;

    constructor(roomId: string, socket: Socket) {
        super({ key: "MeetsInPhaserScene" });
        this.roomId = roomId;
        this.socket = socket;
        this.isChatFocused = false;
        this.configManager = new ConfigManager(this);
    }

    preload(): void {
        this.configManager.initLoad();
    }

    create(): void {
        this.playerManager = new PlayerManager(this);
        this.socketManager = new SocketManager(this.socket, this, this.roomId);
        this.inputManager = new InputManager(this);

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

        if (isChatFocused) {
            this.input.keyboard!.disableGlobalCapture();
        }
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
                socketId: this.currentPlayer?.socketId!,
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
        if (direction === DIRECTION.left) {
            this.movePlayerInDirection(DIRECTION.left, -this.VELOCITY, 0);
            return;
        }

        if (direction === DIRECTION.right) {
            this.movePlayerInDirection(DIRECTION.right, this.VELOCITY, 0);
            return;
        }

        if (direction === DIRECTION.down) {
            this.movePlayerInDirection(DIRECTION.down, 0, this.VELOCITY);
            return;
        }

        if (direction === DIRECTION.up) {
            this.movePlayerInDirection(DIRECTION.up, 0, -this.VELOCITY);
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
}
