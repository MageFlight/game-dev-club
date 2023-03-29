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

export class TestGame extends GameState {
    private objectTree: GameObjectTree;
    
    constructor() {
      super();
      this.objectTree = new GameObjectTree(new PhysicsEngine());
    }
  
    async load() {
      const tex = await ImageTexture.createFromImage(await ResourceLoader.getImage(RightNormalV3), RightNormalV3);
      const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);
  
      console.log("ground: ", ground);
  
      this.objectTree.addGameObjects([
        new Player()
          .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "playerCollider"))
          .addChild(new TextureRect(Vector2.zero(), new Vector2(128, 128), tex, "playerTexture")),
  
        new StaticBody(new Vector2(640, 600), new Vector2(192, 320), 0.8, "wall")
          .addChild(new AABB(Vector2.zero(), new Vector2(192, 320), true, "wallCollider"))
          .addChild(new ColorRect(Vector2.zero(), new Vector2(192, 320), "#ff0000", "wallTex")),
  
        new StaticBody(new Vector2(0, Utils.GAME_HEIGHT - 128), new Vector2(1280, 128), 0.8, "ground")
          .addChild(new AABB(Vector2.zero(), new Vector2(1280, 128), true, "groundCollider"))
          .addChild(new TextureRect(Vector2.zero(), new Vector2(1280, 128), ground, "groundTexture"))
      ]);
    }
  
    override update(dt: number) {
      this.objectTree.update(dt);
    }
  
    override draw() {
      this.objectTree.draw();
    }
  }