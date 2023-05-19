import { GameObjectTree } from "merlin-game-engine/dist/gameObjects/gameObjectTree";
import { GameState } from "merlin-game-engine/dist/gameState";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { PhysicsEngine } from "merlin-game-engine/dist/physicsEngine/physics";
import { TiledTexture } from "merlin-game-engine/dist/resources/textures";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { Level1 } from "../levels/level1";
import { Level0 } from "../levels/level0";
import { Level } from "../levels/level";
import { keyboardHandler, log } from "merlin-game-engine";
import { showLoadingScreen, hideLoadingScreen } from "..";

export class TestGame extends GameState {
  private levelData: Level[];
  private loadedLevel?: GameObjectTree;
  //controls level VVVVVV
  private currentLevel: number = 1;
  private physics: PhysicsEngine;
  private loading: boolean;
  
  constructor() {
    super();
    this.physics = new PhysicsEngine();
    this.levelData = [new Level0(), new Level1()];
    this.loading = false;
  }

  async load() {
    
    const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);

    console.log("ground: ", ground);

    await this.loadCurrentLevel();
  }

  async loadCurrentLevel() {
    showLoadingScreen();
    delete this.loadedLevel;
    this.loadedLevel = new GameObjectTree(this.physics);
    this.loadedLevel.addGameObjects(await this.levelData[this.currentLevel].getGameObjects());
    hideLoadingScreen();
    this.loading = false;
  }

  changeLevel(newLevel: number) {
    this.currentLevel = newLevel;

    this.loadCurrentLevel();
    this.physics.reset();


  }

  override update(dt: number) {
    log("update ", dt);
    this.loadedLevel?.update(dt);
    log("LevelLength: ", this.levelData.length);
    if (keyboardHandler.keyJustReleased("KeyC") && !this.loading) {
      this.loading = true
      this.changeLevel(Math.min(this.currentLevel + 1, this.levelData.length - 1));
    }
    if (keyboardHandler.keyJustReleased("KeyX") && !this.loading) {
      this.loading = true
      this.changeLevel(Math.max(this.currentLevel - 1, 0));
    }
  }

  override draw() {
    this.loadedLevel?.draw();
  }
}





