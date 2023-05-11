import { GameObjectTree } from "merlin-game-engine/dist/gameObjects/gameObjectTree";
import { GameState } from "merlin-game-engine/dist/gameState";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { TiledTexture } from "merlin-game-engine/dist/resources/textures";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { Level1 } from "../levels/level1";
import { Level0 } from "../levels/level0";
import { Level } from "../levels/level";

export class TestGame extends GameState {
  private levelData: Level[];
  private loadedLevel?: GameObjectTree;
  //controls level VVVVVV
  private currentLevel: number = 1;
  private physics: PhysicsEngine;
  
  constructor() {
    super();
    this.physics = new PhysicsEngine();
    this.levelData = [new Level0(), new Level1()];
  }

  async load() {
    
    const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);

    console.log("ground: ", ground);

    await this.loadCurrentLevel();
  }

  async loadCurrentLevel() {
    this.loadedLevel = new GameObjectTree(this.physics);
    this.loadedLevel.addGameObjects(await this.levelData[this.currentLevel].getGameObjects());
  }

  changeLevel(newLevel: number) {
    this.currentLevel = newLevel;
  }

  override update(dt: number) {
    this.loadedLevel?.update(dt);
  }

  override draw() {
    this.loadedLevel?.draw();
  }
}





