import { keyboardHandler, log } from "merlin-game-engine";
import { KinematicBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { MovementController, MovementParameters } from "../components/movementController";

export class Player extends KinematicBody {
    private spawn: Vector2 = new Vector2(128, 128);
    private movementController: MovementController = new MovementController(new MovementParameters(
      1, 0.009, 0.003, 0.007, 0.001, 0.9, 1.6,
      200, 1,
      83, 50,
      0.8, 1.2
      // 0, 0
    ));
    private horizontalDirection: number = 0;
  
    constructor() {
      super(new Vector2(128, 128), new Vector2(128, 128), 0.8, "player");
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
        this.position = this.spawn.clone();
        this.movementController.reset();
      }
    }
  
    override physicsUpdate(physics: PhysicsEngine, dt: number) {
      const groundPlatform = this.getGroundPlatform(Vector2.up());
  
      const velocity = this.movementController.computeVelocity(this.horizontalDirection, keyboardHandler.keyJustPressed("Space"), groundPlatform, 1, physics, dt);
      this.moveAndSlide(velocity, physics, dt);
    }
  }