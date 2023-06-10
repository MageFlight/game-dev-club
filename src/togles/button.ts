import { Region } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Utils } from "merlin-game-engine/dist/utils";

export class Button extends Region {
    private toggleIndex: number;

    constructor(position: Vector2, size: Vector2, toggleIdex: number, name: string) {
        super(position, size, 0b1, 0b1, name);
        this.toggleIndex = toggleIdex;
    }

    override onRegionEnter(region: Region): void {
        if (region.getName().toLowerCase().includes("player")) {
            Utils.broadcast("togglePlatform", this.toggleIndex);
        }
    }
}