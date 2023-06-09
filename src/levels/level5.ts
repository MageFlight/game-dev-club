import { GameObject } from "merlin-game-engine/dist/gameObjects/gameObject";
import { Level } from "./level";
import { ColorRect, TextureRect } from "merlin-game-engine/dist/gameObjects/cameraObjects";
import { StaticBody, AABB } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { TiledTexture } from "merlin-game-engine/dist/resources/textures";
import { Utils } from "merlin-game-engine/dist/utils";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { Button } from "../togles/button";
import { Lever } from "../togles/lever";
import { TogglePlatform } from "../togles/togglePlatform";

export class Level5 implements Level {
    constructor() {}

    createGroundTexture(size: Vector2): Promise<TiledTexture> {
        return TiledTexture.createFromPaths([RightNormalV3], size, new Vector2(64, 64), -1, true, true);
    }

    async createPlatform(x: number, y: number, length: number, width: number, friction: number, name: string, texture: string) {
        return new StaticBody(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(length, width), 0b1, 0b1, friction, name)
            .addChild(new AABB(Vector2.zero(), new Vector2(length, width), true, name + "Collider"))
            .addChild(new TextureRect(Vector2.zero(), new Vector2(length, width), await this.createGroundTexture(new Vector2(length, width)), texture))
    }

    createColorRect(width: number, height: number, color: string, name: string) {
        return new ColorRect(Vector2.zero(), new Vector2(width, height), color, name);
    }

    async createButton(x: number, y: number, width: number, height: number, toggleIndex: number, name: string, color: string) {
        return new Button(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(width, height), toggleIndex, name)
            .addChild(new AABB(Vector2.zero(), new Vector2(width, height), true, name + "Collider"))
            .addChild(this.createColorRect(width, height, color, name + "Texture"));
    }

    async createLever(x: number, y: number, width: number, height: number, toggleIndex: number, name: string, color: string) {
        return new Lever(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(width, height), toggleIndex, name)
            .addChild(new AABB(Vector2.zero(), new Vector2(width, height), true, name + "Collider"))
            .addChild(this.createColorRect(width, height, color, name + "Texture"));
    }

    async createTogglePlatform(x: number, y: number, width: number, height: number, toggleIndex: number, name: string, color: string) {
        return new TogglePlatform(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(width, height), toggleIndex, true, name)
            .addChild(new AABB(Vector2.zero(), new Vector2(width, height), true, name + "Collider"))
            .addChild(this.createColorRect(width, height, color, name + "Texture"));
    }



    public async getGameObjects(): Promise<GameObject[]> {
        return [];
    }
}