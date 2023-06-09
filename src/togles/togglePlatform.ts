import { StaticBody, Region, AABB } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Utils } from "merlin-game-engine/dist/utils";

export class TogglePlatform extends StaticBody {
    private toggleIndex: number;

    constructor(position: Vector2, size: Vector2, toggleIndex: number, isToggled: boolean, name: string) {
        super(position, size, 0b1, 0b1, 0.8, name);
        this.toggleIndex = toggleIndex;
        this.visible = isToggled;

        Utils.listen("togglePlatform", (index: number) => {
            if (index !== this.toggleIndex) return;

            this.toggle(!this.visible);
        });
    }

    protected toggle(desiredState: boolean) {
        this.getChildrenType<AABB>(AABB)[0].setVisible(desiredState);
        this.visible = desiredState;
    }
}