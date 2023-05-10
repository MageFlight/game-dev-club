import { TextureRect, ColorRect } from "merlin-game-engine/dist/gameObjects/cameraObjects";
import { GameObjectTree } from "merlin-game-engine/dist/gameObjects/gameObjectTree";
import { AABB, StaticBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { GameState } from "merlin-game-engine/dist/gameState";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { ResourceLoader } from "merlin-game-engine/dist/resources/resource";
import { ImageTexture, TiledTexture } from "merlin-game-engine/dist/resources/textures";
import { Utils } from "merlin-game-engine/dist/utils";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { Player } from "../characters/player";
import { SquarePlayer } from "../characters/squarePlayer";
import { log } from "merlin-game-engine";
import { Level1 } from "../levels/level1";

export class TestGame extends GameState {
  private levels: GameObjectTree[] = [];
  //controls level VVVVVV
  private currentLevel: number = 1;
  private physics: PhysicsEngine;
  
  constructor() {
    super();
    this.physics = new PhysicsEngine();
  }

  async load() {
    
    const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);

    console.log("ground: ", ground);

    

    const level1 = new GameObjectTree(this.physics);
    const idkWhatToName = new Level1();
    level1.addGameObjects(
      await idkWhatToName.getGameObjects()
    );
    this.levels.push(level1);
  }

  override update(dt: number) {
    log("levelLength: ", this.levels.length, " CurrentLevel: ", this.currentLevel);
    this.levels[this.currentLevel].update(dt);
  }

  override draw() {
    this.levels[this.currentLevel].draw();
  }
}





