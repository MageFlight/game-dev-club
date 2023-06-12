import { keyboardHandler, log } from "merlin-game-engine";
import { AABB, CollisionObject, KinematicBody, Region, StaticBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { CollisionData, PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { MovementController, MovementParameters } from "../components/movementController";
import { Utils } from "merlin-game-engine/dist/utils";

export class Player extends KinematicBody {
    private spawn: Vector2 = new Vector2(128, 128);
    private movementController: MovementController = new MovementController(new MovementParameters(
      1, 0.009, 0.003, 0.007, 0.001, 0.9, 1.6,
      200, 0,
      83, 50,
      0.8, 1.2
      // 0, 0
    ));
    private horizontalDirection: number = 0;
    private willDie: boolean = false;
  
    constructor() {
      super(new Vector2(128, 128), new Vector2(128, 128), 0b1, 0b1, Vector2.zero(), true, 0.8, "player");
    }
  
    override update(dt: number) {
      const pressLeft: boolean = keyboardHandler.isKeyDown("KeyA");
      const pressRight: boolean = keyboardHandler.isKeyDown("KeyD");
      if (pressLeft == pressRight) {
        this.horizontalDirection = 0;
      } else if (pressLeft) {
        this.horizontalDirection = -1;
      } else {
        this.horizontalDirection = 1;
      }
  
      this.willDie = this.willDie || this.shouldDie();
      if (this.willDie) this.die();
    }

    private shouldDie(): boolean {
      const isOutsideWorld = this.position.x < -this.size.x || this.position.x > Utils.GAME_WIDTH || this.position.y < -this.size.y || this.position.y > Utils.GAME_HEIGHT;
      const squished = this.lastFrameCollisions.some((collision1: CollisionData) => {
        for (const collision2 of this.lastFrameCollisions) {
          const collision1WasColliderA = collision1.colliderA === this;
          const collision2WasColliderA = collision2.colliderA === this;
          const otherCollider1 = collision1WasColliderA ? collision1.colliderB : collision1.colliderA;
          const otherCollider2 = collision2WasColliderA ? collision2.colliderB : collision2.colliderA;

          log("collision1ColliderA: ", collision1.colliderA.getName(), " collision1ColliderB: ", collision1.colliderB?.getName(), " normal: ", collision1.normal);
          log("collision2ColliderA: ", collision2.colliderA.getName(), " collision2ColliderB: ", collision2.colliderB?.getName(), " normal: ", collision2.normal);
          log("---");

          const correctedCollision1Normal = collision1WasColliderA ? collision1.normal : collision1.normal.multiply(-1);
          const correctedCollision2Normal = collision2WasColliderA ? collision2.normal : collision2.normal.multiply(-1);
          
          if (!correctedCollision1Normal.equals(correctedCollision2Normal.multiply(-1))) continue;

          const staticAndUnpushable = otherCollider1 instanceof StaticBody && otherCollider2 instanceof KinematicBody && !otherCollider2.isPushable();
          const unpushableAndStatic = otherCollider2 instanceof StaticBody && otherCollider1 instanceof KinematicBody && !otherCollider1.isPushable();
          if (staticAndUnpushable || unpushableAndStatic) return true;
        }
      });

      return isOutsideWorld || squished;
    }



    override onRegionEnter(region: Region): void {
      if (region.getName().toLowerCase().includes("spike")) {
        this.willDie = true;
      }
    }

    private die() {
      this.position = this.spawn.clone();
      this.velocity = Vector2.zero();
      this.movementController.reset();
      this.willDie = false;
    }
  
    override physicsUpdate(physics: PhysicsEngine, dt: number) {
      const groundPlatform = this.getGroundPlatform(Vector2.up());
  
      this.velocity = this.movementController.computeVelocity(this.velocity, this.horizontalDirection, keyboardHandler.keyJustPressed("Space"), groundPlatform, 1, physics, dt);
    }
  }