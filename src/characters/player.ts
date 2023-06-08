import { keyboardHandler, log } from "merlin-game-engine";
import { KinematicBody, Region } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { MovementController, MovementParameters } from "../components/movementController";
import { Utils } from "merlin-game-engine/dist/utils";

export class Player extends KinematicBody {
    private spawn: Vector2;
    private movementController: MovementController = new MovementController(new MovementParameters(
      1, 0.009, 0.003, 0.007, 0.001, 0.9, 1.6,
      100, 0,
      83, 50,
      0.8, 1.2
      // 0, 0
    ));
    private horizontalDirection: number = 0;
  
    constructor(position: Vector2) {
      super(position, new Vector2(128, 128), 0b1, 0b1, Vector2.zero(), true, 0.8, "player");
      this.spawn = position.clone();
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
  
      if (this.position.y > 1088) {
        this.die();
      }
    }

    override onRegionEnter(region: Region): void {
      if (region.getName() == "endBox") {
        Utils.broadcast("nextLevel");
      }
    }

    private die() {
      this.position = this.spawn.clone();
      this.velocity = Vector2.zero();
      this.movementController.reset();
    }
  
    override physicsUpdate(physics: PhysicsEngine, dt: number) {
      const groundPlatform = this.getGroundPlatform(Vector2.up());
  
      this.velocity = this.movementController.computeVelocity(this.velocity, this.horizontalDirection, keyboardHandler.keyJustPressed("Space"), groundPlatform, 1, physics, dt);
    }
  }