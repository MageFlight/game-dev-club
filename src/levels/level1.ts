import { GameObject } from "merlin-game-engine/dist/gameObjects/gameObject";
import { Level } from "./level";
import { TextureRect, ColorRect } from "merlin-game-engine/dist/gameObjects/cameraObjects";
import { AABB, Region, StaticBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Player } from "../characters/player";
import { SquarePlayer } from "../characters/squarePlayer";
import { ImageTexture, TiledTexture } from "merlin-game-engine/dist/resources/textures";
import { Utils } from "merlin-game-engine/dist/utils";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { ResourceLoader } from "merlin-game-engine/dist/resources/resource";

export class Level1 implements Level {
    constructor() {}

    /*
    Instead of declaring a single variable as ground dimensions, texture setups etc,
    this function is called to return the exact same thing.

    Original:
    const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);
    */
    createGroundTexture(size: Vector2): Promise<TiledTexture> {
        return TiledTexture.createFromPaths([RightNormalV3], size, new Vector2(64, 64), -1, true, true);
      }
  
      async createPlatform(x: number, y: number, length: number, width: number, friction: number, name: string, texture: string) {
        return new StaticBody(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(length, width), 0b1, 0b1, friction, name)
          .addChild(new AABB(Vector2.zero(), new Vector2(length, width), true, name + "Collider"))
          .addChild(new TextureRect(Vector2.zero(), new Vector2(length, width), await this.createGroundTexture(new Vector2(length, width)), texture))
      }

    async getGameObjects(): Promise<GameObject[]> {
        /*
        One tile = 128
        Current dimensions: 1920 x 1087 (15 x ~8.5 tiles)
        (1024)

        Probably a good idea to change resolution to 16:9 sometime
        */
        const tex = await ImageTexture.createFromImage(await ResourceLoader.getImage(RightNormalV3), RightNormalV3);

        return [
            new Player(new Vector2(192, 640))
            .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "playerCollider"))
            .addChild(new TextureRect(Vector2.zero(), new Vector2(128, 128), tex, "playerTexture")),
          
            new SquarePlayer(new Vector2(64, 384), "squarePlayer")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "squarePlayerCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#00ff00", "squarePlayerTexture")),
    
            await this.createPlatform(0, Utils.GAME_HEIGHT, Utils.GAME_WIDTH, 64, 0.8, "ground", "groundTexture"),
            await this.createPlatform(0, 576, 640, 64, 0.8, "ground", "groundTexture"),
            await this.createPlatform(0, Utils.GAME_HEIGHT - 64, 64, 448, 0.8, "ground", "groundTexture"),
            await this.createPlatform(0, Utils.GAME_HEIGHT/2 - 32, 64, 192, 0.8, "ground", "groundTexture"),           
            await this.createPlatform(0, 320, 512, 320, 0.8, "ground", "groundTexture"),           
            await this.createPlatform(1344, 320, Utils.GAME_WIDTH - 1344, 320, 0.8, "ground", "groundTexture"),           
            await this.createPlatform(Utils.GAME_WIDTH - 64, Utils.GAME_HEIGHT - 64, 64, Utils.GAME_HEIGHT - 384, 0.8, "ground", "groundTexture"),           
            await this.createPlatform(320, 64, 1024, 64, 0.8, "ground", "groundTexture"),
            new Region(new Vector2(Utils.GAME_WIDTH - 256, Utils.GAME_HEIGHT - 512), new Vector2(192, 192), 0b1, 0b1, "endBox")
                .addChild(new AABB(Vector2.zero(), new Vector2(192, 192), true, "endBoxCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(192, 192), "orange", "endBoxTexture"))
        ];         
    }
}