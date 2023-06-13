import { keyboardHandler, log } from "merlin-game-engine";
import { KinematicBody, Region } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { CollisionData, PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { Utils } from "merlin-game-engine/dist/utils";
import { Player } from "./player";

export class SquarePlayer extends KinematicBody {
    private spawnpoint: Vector2;
    private speed: number = 0.5;
    private willDie: boolean = false;
    private direction: Vector2 = Vector2.zero();

    constructor(spawnpoint: Vector2, name: string) {
        super(spawnpoint, new Vector2(128, 128), 0b1, 0b1, Vector2.zero(), false, 0.8, name);
        this.spawnpoint = spawnpoint.clone();
    }

    override update(dt: number): void {
        log("Update squarePlayer");
        log("Square Velocity: ", this.velocity);
        log("Square Direction: ", this.direction);
        if (keyboardHandler.keyJustPressed("ArrowRight") && this.direction.equals(Vector2.zero())) {
            this.direction.x = 1;
        } else if (keyboardHandler.keyJustPressed("ArrowLeft") && this.direction.equals(Vector2.zero())) {
            this.direction.x = -1;
        } else if (keyboardHandler.keyJustPressed("ArrowUp") && this.direction.equals(Vector2.zero())) {
            this.direction.y = -1;
        } else if (keyboardHandler.keyJustPressed("ArrowDown") && this.direction.equals(Vector2.zero())) {
            this.direction.y = 1;
        }

        const desiredVelocity = this.direction.multiply(this.speed);
        if (!this.velocity.equals(desiredVelocity)) this.velocity = desiredVelocity;

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

    override onCollision(collision: CollisionData): void {
        const otherCollider = collision.colliderA === this ? collision.colliderB : collision.colliderA;
        log("Squareplayer OnCollision");
        log("otherCollider: ", otherCollider?.getName());

        log("collisionNormal: ", collision.normal);
        log("direction: ", this.direction);
        if (otherCollider !== undefined && !(otherCollider instanceof Player) && !this.direction.equals(Vector2.zero()) && collision.normal.abs().equals(this.direction.abs())) {
            this.direction = Vector2.zero();
        }
    }

    die() {
        this.position = this.spawnpoint.clone();
        this.velocity = Vector2.zero();
        this.willDie = false;
    }
}
