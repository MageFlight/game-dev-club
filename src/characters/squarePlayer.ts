import { keyboardHandler, log } from "merlin-game-engine";
import { KinematicBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";

export class SquarePlayer extends KinematicBody {
    private spawnpoint: Vector2;
    private velocity: Vector2 = Vector2.zero();
    private speed: number = 0.5;

    constructor(spawnpoint: Vector2, name: string) {
        super(spawnpoint, new Vector2(128, 128), 0.8, name);
        this.spawnpoint = spawnpoint.clone();
    }

    override update(dt: number): void {
        log("Update squarePlayer");
        log("SquareVel: ", this.velocity);
        if (keyboardHandler.keyJustPressed("ArrowRight") && this.velocity.equals(Vector2.zero())) {
            this.velocity.x = this.speed;
        } else if (keyboardHandler.keyJustPressed("ArrowLeft") && this.velocity.equals(Vector2.zero())) {
            this.velocity.x = -this.speed;
        } else if (keyboardHandler.keyJustPressed("ArrowUp") && this.velocity.equals(Vector2.zero())) {
            this.velocity.y = -this.speed;
        } else if (keyboardHandler.keyJustPressed("ArrowDown") && this.velocity.equals(Vector2.zero())) {
            this.velocity.y = this.speed;
        }
    }

    override physicsUpdate(physics: PhysicsEngine, dt: number): void {
        this.moveAndSlide(this.velocity, physics, dt);
    }

    die() {
        this.position = this.spawnpoint.clone();
    }
}
