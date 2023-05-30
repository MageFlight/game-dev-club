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

function wait(delay: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), delay);
    });
}

export class Level0 implements Level {
    constructor() {}

    async getGameObjects(): Promise<GameObject[]> {
        const tex = await ImageTexture.createFromImage(await ResourceLoader.getImage(RightNormalV3), RightNormalV3);
        const ground = await TiledTexture.createFromPaths([RightNormalV3], new Vector2(1280, 128), new Vector2(64, 64), -1, true, true);
        
        const gameObjects = [
            new Player()
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "playerCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(128, 128), tex, "playerTexture")),
            
            new SquarePlayer(new Vector2(128, 128), "squarePlayer")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "squarePlayerCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "#00ff00", "squarePlayerTexture")),

            new StaticBody(new Vector2(0, Utils.GAME_HEIGHT - 128), new Vector2(1280, 128), 0.8, "ground")
                .addChild(new AABB(Vector2.zero(), new Vector2(1280, 128), true, "groundCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(1280, 128), ground, "groundTexture")),
            new Region(new Vector2(900, Utils.GAME_HEIGHT - 256), new Vector2(128, 128), "endBox")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "endBoxCollider"))
                .addChild(new ColorRect(Vector2.zero(), new Vector2(128, 128), "orange", "endBoxTexture"))
        ];
        await wait(10000);


        return gameObjects;
    }
}