import { GameObject } from "merlin-game-engine/dist/gameObjects/gameObject";
import { Level } from "./level";
import { TextureRect, ColorRect } from "merlin-game-engine/dist/gameObjects/cameraObjects";
import { AABB, Region, StaticBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Utils } from "merlin-game-engine/dist/utils";
import { Player } from "../characters/player";
import { SquarePlayer } from "../characters/squarePlayer";
import { ResourceLoader } from "merlin-game-engine/dist/resources/resource";
import { ImageTexture, TiledTexture } from "merlin-game-engine/dist/resources/textures";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { TogglePlatform } from "../togles/togglePlatform";
import { Lever } from "../togles/lever";
import { Button } from "../togles/button";

export class Level1 implements Level {
    constructor() {}

    async getGameObjects(): Promise<GameObject[]> {
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

            new TogglePlatform(new Vector2(512, Utils.GAME_HEIGHT - 256), new Vector2(128, 128), 1, "toggle1")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "toggle1Collider"))
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