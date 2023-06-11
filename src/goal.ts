import { KinematicBody, Region } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Player } from "./characters/player";
import { SquarePlayer } from "./characters/squarePlayer";
import { Utils } from "merlin-game-engine/dist/utils";
import { log } from "merlin-game-engine";

export class Goal extends Region {
    constructor(position: Vector2, size: Vector2) {
        super(position, size, 0b1, 0b1, "goal");
    }

    override update(dt: number): void {
        log("goalRegionsInside: ", this.regionsInside.map((region: Region) => region.getName()));
        const platformerPlayerInside = this.regionsInside.filter((otherRegion: Region) => otherRegion instanceof Player).length;
        const squarePlayerInside = this.regionsInside.filter((otherRegion: Region) => otherRegion instanceof SquarePlayer).length;
        if (platformerPlayerInside > 0 && squarePlayerInside > 0) {
            Utils.broadcast("nextLevel");
        }
    }
}