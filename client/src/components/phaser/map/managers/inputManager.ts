import { MeetsInPhaserScene } from "../phaserScene";
import { DIRECTION, Direction, EtcKeyboardInputType } from "@/types/phaser.type";

export class InputManager {
    private scene: MeetsInPhaserScene;
    private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys;
    private etcKeyboardInput: EtcKeyboardInputType;

    constructor(scene: MeetsInPhaserScene) {
        this.scene = scene;
        const keyboard = this.scene.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
        this.keyboardInput = keyboard.createCursorKeys();
        this.etcKeyboardInput = keyboard.addKeys("W,A,S,D") as EtcKeyboardInputType;
    }

    getCurrentDirection(): Direction | null {
        if (this.keyboardInput.left.isDown || this.etcKeyboardInput?.A.isDown) {
            return DIRECTION.left;
        }

        if (this.keyboardInput.right.isDown || this.etcKeyboardInput?.D.isDown) {
            return DIRECTION.right;
        }

        if (this.keyboardInput.up.isDown || this.etcKeyboardInput?.W.isDown) {
            return DIRECTION.up;
        }

        if (this.keyboardInput.down.isDown || this.etcKeyboardInput?.S.isDown) {
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
            this.etcKeyboardInput.W.isDown ||
            this.etcKeyboardInput.A.isDown ||
            this.etcKeyboardInput.S.isDown ||
            this.etcKeyboardInput.D.isDown
        );
    }

    isAllCursorKeyUp(): boolean {
        return (
            this.keyboardInput.left.isUp &&
            this.keyboardInput.right.isUp &&
            this.keyboardInput.up.isUp &&
            this.keyboardInput.down.isUp &&
            this.etcKeyboardInput.W.isUp &&
            this.etcKeyboardInput.A.isUp &&
            this.etcKeyboardInput.S.isUp &&
            this.etcKeyboardInput.D.isUp
        );
    }
}
