export const phaserConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#6FCF97",
    transparent: true,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
    scale: {
        // 게임 div의 id
        parent: "gamediv",
        width: "100%",
        height: "100%",
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};
