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
import { TogglePlatform } from "../togles/togglePlatform";
import { Lever } from "../togles/lever";
import { Button } from "../togles/button";

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
        const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);
        
        const gameObjects = [
            new Player(new Vector2(128, 128))
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "playerCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(128, 128), tex, "playerTexture")),
            
            new SquarePlayer(new Vector2(128, 128), "squarePlayer")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "squarePlayerCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#00ff00", "squarePlayerTexture")),

            new StaticBody(new Vector2(640, 600), new Vector2(192, 320), 0b1, 0b1, 0.8, "wall")
                .addChild(new AABB(Vector2.zero(), new Vector2(192, 320), true, "wallCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(192, 320), "#ff0000", "wallTex")),

            new StaticBody(new Vector2(0, Utils.GAME_HEIGHT - 128), new Vector2(1280, 128), 0b1, 0b1, 0.8, "ground")
                .addChild(new AABB(Vector2.zero(), new Vector2(1280, 128), true, "groundCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(1280, 128), ground, "groundTexture")),
           
            new Region(new Vector2(900, Utils.GAME_HEIGHT - 256), new Vector2(128, 128), 0b1, 0b1, "endBox")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "endBoxCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "orange", "endBoxTexture")),

            new TogglePlatform(new Vector2(512, Utils.GAME_HEIGHT - 256), new Vector2(128, 128), 1, false, "toggle1")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), false, "toggle1Collider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#ffff00", "toggle1Texture")),

            new Lever(new Vector2(672, 600 - 128), new Vector2(128, 128), 1, "lever1")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "lever1Collider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#ff00ff", "lever1Texture")),

            new Button(new Vector2(0, Utils.GAME_HEIGHT - 256), new Vector2(128, 128), 1, "lever1")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "lever1Collider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#00ffff", "lever1Texture"))
        ];

        return gameObjects;
    }
}