import { MeetsInPhaserScene } from "../phaserScene";
import { DIRECTION, Direction, WASDKeys } from "@/types/phaser.type";


export class InputManager {
    private scene: MeetsInPhaserScene;
    private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeysInput: WASDKeys;

    constructor(scene: MeetsInPhaserScene) {
        this.scene = scene;
        const keyboard = this.scene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
        this.keyboardInput = keyboard.createCursorKeys();
        this.wasdKeysInput = keyboard.addKeys("W,A,S,D") as WASDKeys;
    }

    getCurrentDirection(): Direction | null {
        if (this.keyboardInput.left.isDown || this.wasdKeysInput?.A.isDown) {
            return DIRECTION.left;
        }

        if (this.keyboardInput.right.isDown || this.wasdKeysInput?.D.isDown) {
            return DIRECTION.right;
        }

        if (this.keyboardInput.up.isDown || this.wasdKeysInput?.W.isDown) {
            return DIRECTION.up;
        }

        if (this.keyboardInput.down.isDown || this.wasdKeysInput?.S.isDown) {

            return DIRECTION.down;
        }
        return null;
    }

    isAnyCursorKeyDown(): boolean {
        return (
            this.keyboardInput.left.isDown ||
            this.keyboardInput.right.isDown ||
            this.keyboardInput.up.isDown ||
            this.keyboardInput.down.isDown ||
            this.wasdKeysInput.W.isDown ||
            this.wasdKeysInput.A.isDown ||
            this.wasdKeysInput.S.isDown ||
            this.wasdKeysInput.D.isDown
        );
    }

    isAllCursorKeyUp(): boolean {
        return (
            this.keyboardInput.left.isUp &&
            this.keyboardInput.right.isUp &&
            this.keyboardInput.up.isUp &&
            this.keyboardInput.down.isUp &&
            this.wasdKeysInput.W.isUp &&
            this.wasdKeysInput.A.isUp &&
            this.wasdKeysInput.S.isUp &&
            this.wasdKeysInput.D.isUp
        );
    }
}
