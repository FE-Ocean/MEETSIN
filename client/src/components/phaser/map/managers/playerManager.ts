import { MeetsInPhaserScene } from "../phaserScene";
import { MoveInfo, PlayerContainerType, PlayerInfo, SyncInfo } from "@/types/phaser.type";

export class PlayerManager {
    private scene: MeetsInPhaserScene;
    public otherPlayers: Phaser.Physics.Arcade.Group;

    constructor(scene: MeetsInPhaserScene) {
        this.scene = scene;
        this.otherPlayers = this.scene.physics.add.group();
    }

    addPlayer(playerInfo: PlayerInfo): PlayerContainerType {
        const { x, y, socketId, characterId, user } = playerInfo;

        // 스프라이트 생성
        const playerSprite = this.scene.physics.add.sprite(0, 0, `player${characterId}`);
        playerSprite.anims.play(`idle-down-${characterId}`);
        playerSprite.setOrigin(0, 0);
        playerSprite.setSize(16, 16);

        // 네임태그 생성
        const nameTag = this.createNameTag(playerSprite, user.userName);

        // 컨테이너 생성 및 스프라이트와 네임태그 추가
        const container = this.scene.add.container(x, y) as PlayerContainerType;
        container.add(playerSprite);
        container.add(nameTag);

        // 컨테이너에 물리 속성 적용
        this.scene.physics.world.enable(container);
        const body = container.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setSize(playerSprite.width, playerSprite.height);

        container.socketId = socketId;
        container.moving = false;
        container.playerSprite = playerSprite;
        container.characterId = characterId;
        container.nameTag = nameTag;

        return container;
    }

    addCurrentPlayer(playerInfo: PlayerInfo): void {
        const player = this.addPlayer(playerInfo);
        this.scene.currentPlayer = player;
        this.scene.cameras.main.startFollow(player);
        this.scene.physics.add.collider(player, this.scene.layerBlockOutdoor);
        this.scene.physics.add.collider(player, this.scene.layerBlockWall);
        this.scene.physics.add.collider(player, this.scene.layerBlockFurniture);

        this.scene.cameras.main.startFollow(player);
        if (this.scene.cameras.main) {
            this.scene.cameras.main.setZoom(this.scene.zoomLevel);
        }
        this.scene.cameras.main.setRoundPixels(true);
    }

    addOtherPlayer(playerInfo: PlayerInfo): void {
        const player = this.addPlayer(playerInfo);
        this.otherPlayers.add(player);
    }

    movePlayer(info: MoveInfo) {
        const animKey = `walk-${info.direction}-${info.characterId}`;

        if (info.sprite.anims.currentAnim?.key === animKey) {
            info.body.setVelocity(info.velocityX, info.velocityY);
        } else {
            info.sprite.play(animKey);
        }
    }

    syncPlayerPosition(info: SyncInfo) {
        const playerContainer = (this.otherPlayers.getChildren() as PlayerContainerType[]).find(
            (player) => player.socketId === info.socketId,
        );

        const animationKey = `walk-${info.direction}-${playerContainer?.characterId}`;

        if (!playerContainer) return;

        if (
            !playerContainer?.playerSprite.anims.isPlaying ||
            playerContainer.playerSprite.anims.currentAnim?.key !== animationKey
        ) {
            playerContainer.playerSprite.play(animationKey);
        }

        playerContainer.moving = true;
        playerContainer.setPosition(info.x, info.y);
    }

    stopPlayer(socketId: string): void {
        if (!this.otherPlayers) return;

        const playerContainer = (this.otherPlayers.getChildren() as PlayerContainerType[]).find(
            (playerContainer) => playerContainer.socketId === socketId,
        );

        const stopAnim = playerContainer?.playerSprite.anims.currentAnim?.key.slice(5);

        if (playerContainer?.moving) {
            playerContainer.playerSprite.play(`idle-${stopAnim}`);
        }
        playerContainer!.moving = false;
    }

    removePlayer(socketId: string): void {
        if (!this.otherPlayers) return;

        (this.otherPlayers.getChildren() as PlayerContainerType[]).forEach((otherPlayer) => {
            if (socketId === otherPlayer.socketId) {
                otherPlayer.nameTag.destroy();
                otherPlayer.destroy();
            }
        });
    }

    private createNameTag(
        playerSprite: Phaser.GameObjects.Sprite,
        userName: string,
    ): Phaser.GameObjects.Text {
        const nameTag = this.scene.add
            .text(playerSprite.width / 2, -15, userName, {
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
}
