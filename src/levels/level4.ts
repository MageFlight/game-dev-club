import { GameObject } from "merlin-game-engine/dist/gameObjects/gameObject";
import { Level } from "./level";
import { Player } from "../characters/player";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { AABB, StaticBody } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { ColorRect, TextureRect } from "merlin-game-engine/dist/gameObjects/cameraObjects";
import { SquarePlayer } from "../characters/squarePlayer";
import { Utils } from "merlin-game-engine/dist/utils";
import { ImageTexture, TiledTexture } from "merlin-game-engine/dist/resources/textures";
import { ResourceLoader } from "merlin-game-engine/dist/resources/resource";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";

export class Level4 implements Level {
    constructor() {}

    async getGameObjects(): Promise<GameObject[]> {
        const tex = await ImageTexture.createFromImage(await ResourceLoader.getImage(RightNormalV3), RightNormalV3);
        const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(Utils.GAME_WIDTH, 128), new Vector2(64, 64), -1, true, true);
        const groundBlock = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(640, 320), new Vector2(64, 64), -1, true, true);
        const thinHorizontal = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(640, 64), new Vector2(64, 64), -1, true, true);
        const wall = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(64, Utils.GAME_HEIGHT), new Vector2(64, 64), -1, true, true);

        const objects: GameObject[] = [
            new Player(new Vector2(256, Utils.GAME_HEIGHT - 576))
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "playerCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(128, 128), tex, "playerTexture")),
            
            new SquarePlayer(new Vector2(64, Utils.GAME_HEIGHT - 832), "squarePlayer")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "squarePlayerCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#00ff00", "squarePlayerTexture")),

            new StaticBody(Vector2.zero(), new Vector2(Utils.GAME_WIDTH, 10), 0b1, 0b1, 0.8, "ceiling")
                .addChild(new AABB(Vector2.zero(), new Vector2(1280, 128), true, "ceilingCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(1280, 128), ground, "ceilingTexture")),
            
            new StaticBody(new Vector2(0, Utils.GAME_HEIGHT - 128), new Vector2(Utils.GAME_WIDTH, 128), 0b1, 0b1, 0.8, "ground")
                .addChild(new AABB(Vector2.zero(), new Vector2(Utils.GAME_WIDTH, 128), true, "groundCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(Utils.GAME_WIDTH, 128), ground, "groundTexture")),
            
            new StaticBody(new Vector2(0, Utils.GAME_HEIGHT - 448), new Vector2(640, 320), 0b1, 0b1, 0.8, "ground1")
                .addChild(new AABB(Vector2.zero(), new Vector2(640, 320), true, "ground1Collider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(640, 320), groundBlock, "ground1Texture")),
            
            new StaticBody(new Vector2(Utils.GAME_WIDTH - 640, Utils.GAME_HEIGHT - 448), new Vector2(640, 320), 0b1, 0b1, 0.8, "ground2")
                .addChild(new AABB(Vector2.zero(), new Vector2(512, 320), true, "ground2Collider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(640, 320), groundBlock, "ground2Texture")),

            new StaticBody(new Vector2(0, Utils.GAME_HEIGHT - 704), new Vector2(640, 64), 0b1, 0b1, 0.8, "middle")
                .addChild(new AABB(Vector2.zero(), new Vector2(640, 64), true, "middleCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(640, 64), thinHorizontal, "middleTexture")),
            
            new StaticBody(Vector2.zero(), new Vector2(64, Utils.GAME_HEIGHT), 0b1, 0b1, 0.8, "wallLeft")
                .addChild(new AABB(Vector2.zero(), new Vector2(64, Utils.GAME_HEIGHT), true, "wallLeftCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(64, Utils.GAME_HEIGHT), wall, "wallLeftTexture")),

            new StaticBody(new Vector2(Utils.GAME_WIDTH - 64, 0), new Vector2(64, Utils.GAME_HEIGHT), 0b1, 0b1, 0.8, "wallRight")
                .addChild(new AABB(Vector2.zero(), new Vector2(64, Utils.GAME_HEIGHT), true, "wallRightCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(64, Utils.GAME_HEIGHT), wall, "wallRightTexture")),
        ];

        return objects;
    }
}