import { MeetsInPhaserScene } from "../phaserScene";

export class ConfigManager {
    private scene: MeetsInPhaserScene;

    constructor(scene: MeetsInPhaserScene) {
        this.scene = scene;
    }

    initLoad(): void {
        this.scene.load.image("base", "/map/base.png");
        this.scene.load.image("indoor", "/map/indoor.png");
        this.scene.load.image("urban", "/map/urban.png");
        this.scene.load.tilemapTiledJSON("map", "/map/map.json");
        for (let i = 1; i <= 6; i++) {
            this.scene.load.spritesheet(`player${i}`, `/players/player${i}.png`, {
                frameWidth: 16,
                frameHeight: 16,
            });
        }
    }

    setupMap(): void {
        const map = this.scene.make.tilemap({ key: "map" });

        const tileBase = map.addTilesetImage("base", "base")!;
        const tileIndoor = map.addTilesetImage("indoor", "indoor")!;
        const tileUrban = map.addTilesetImage("urban", "urban")!;

        map.createLayer("ground", [tileBase, tileUrban], 0, 0);
        this.scene.layerBlockOutdoor = map.createLayer(
            "block-outdoor",
            [tileBase, tileUrban],
            0,
            0,
        )!;
        this.scene.layerBlockWall = map.createLayer("block-wall", [tileBase, tileUrban], 0, 0)!;
        this.scene.layerBlockFurniture = map.createLayer(
            "block-furniture",
            [tileBase, tileIndoor],
            0,
            0,
        )!;
        map.createLayer("furniture", [tileBase, tileIndoor, tileUrban], 0, 0);
        const layerChairBack = map.createLayer("chair-back", [tileBase, tileIndoor], 0, 0);
        map.createLayer("top-decorations", [tileBase, tileUrban], 0, 0);

        layerChairBack!.setDepth(2);

        this.scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.scene.cameras.main.scrollX = -map.widthInPixels / 2;
        this.scene.cameras.main.scrollY = -map.heightInPixels / 2;

        this.scene.layerBlockOutdoor.setCollisionByExclusion([-1]);
        this.scene.layerBlockWall.setCollisionByExclusion([-1]);
        this.scene.layerBlockFurniture.setCollisionByExclusion([-1]);
    }

    setupCollisions(players: Phaser.Physics.Arcade.Sprite[]): void {
        players.forEach((player) => {
            this.scene.physics.add.collider(player, this.scene.layerBlockOutdoor);

            this.scene.physics.add.collider(player, this.scene.layerBlockIndoor);
        });
    }

    setupAnimations(): void {
        for (let i = 1; i <= 6; i++) {
            const spriteKey = `player${i}`;

            this.scene.anims.create({
                key: `walk-left-${i}`,
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { frames: [0, 4, 8] }),
                frameRate: 10,
                repeat: -1,
            });

            this.scene.anims.create({
                key: `walk-right-${i}`,
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { frames: [3, 7, 11] }),
                frameRate: 10,
                repeat: -1,
            });

            this.scene.anims.create({
                key: `walk-up-${i}`,
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { frames: [2, 6, 10] }),
                frameRate: 10,
                repeat: -1,
            });

            this.scene.anims.create({
                key: `walk-down-${i}`,
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { frames: [1, 5, 9] }),
                frameRate: 10,
                repeat: -1,
            });

            this.scene.anims.create({
                key: `idle-left-${i}`,
                frames: [{ key: spriteKey, frame: 0 }],
                frameRate: 1,
            });

            this.scene.anims.create({
                key: `idle-right-${i}`,
                frames: [{ key: spriteKey, frame: 3 }],
                frameRate: 1,
            });

            this.scene.anims.create({
                key: `idle-up-${i}`,
                frames: [{ key: spriteKey, frame: 2 }],
                frameRate: 1,
            });

            this.scene.anims.create({
                key: `idle-down-${i}`,
                frames: [{ key: spriteKey, frame: 1 }],
                frameRate: 1,
            });
        }
    }
}
