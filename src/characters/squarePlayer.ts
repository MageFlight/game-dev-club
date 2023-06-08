import { keyboardHandler, log } from "merlin-game-engine";
import { KinematicBody, Region } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { Utils } from "merlin-game-engine/dist/utils";

export class SquarePlayer extends KinematicBody {
    private spawnpoint: Vector2;
    private speed: number = 0.5;
    private willDie: boolean = false;

    constructor(spawnpoint: Vector2, name: string) {
        super(spawnpoint, new Vector2(128, 128), 0b1, 0b1, Vector2.zero(), false, 0.8, name);
        this.spawnpoint = spawnpoint.clone();
    }

    override update(dt: number): void {
        log("Update squarePlayer");
        log("Square Velocity: ", this.velocity);
        if (keyboardHandler.keyJustPressed("ArrowRight") && this.velocity.equals(Vector2.zero())) {
            this.velocity.x = this.speed;
        } else if (keyboardHandler.keyJustPressed("ArrowLeft") && this.velocity.equals(Vector2.zero())) {
            this.velocity.x = -this.speed;
        } else if (keyboardHandler.keyJustPressed("ArrowUp") && this.velocity.equals(Vector2.zero())) {
            this.velocity.y = -this.speed;
        } else if (keyboardHandler.keyJustPressed("ArrowDown") && this.velocity.equals(Vector2.zero())) {
            this.velocity.y = this.speed;
        }

        this.willDie = this.willDie || this.shouldDie();

        if (this.willDie) this.die();
    }

    private shouldDie(): boolean {
        const isOutsideWorld = this.position.x < -this.size.x || this.position.x > Utils.GAME_WIDTH || this.position.y < -this.size.y || this.position.y > Utils.GAME_HEIGHT;

        return isOutsideWorld;
    }

    override onRegionEnter(region: Region): void {
        if (region.getName().toLowerCase().includes("spike")) {
            this.willDie = true;
        }
    }

    die() {
        this.position = this.spawnpoint.clone();
        this.velocity = Vector2.zero();
        this.willDie = false;
    }
}
