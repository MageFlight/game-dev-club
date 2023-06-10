import { GameObject } from "merlin-game-engine/dist/gameObjects/gameObject";
import { Level } from "./level";
import { ColorRect, TextureRect } from "merlin-game-engine/dist/gameObjects/cameraObjects";
import { StaticBody, AABB, Region } from "merlin-game-engine/dist/gameObjects/physicsObjects";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { ImageTexture, TiledTexture } from "merlin-game-engine/dist/resources/textures";
import { Utils } from "merlin-game-engine/dist/utils";
import RightNormalV3 from "../../assets/player/rightNormalV3.svg";
import { Button } from "../togles/button";
import { Lever } from "../togles/lever";
import { TogglePlatform } from "../togles/togglePlatform";
import { Player } from "../characters/player";
import { SquarePlayer } from "../characters/squarePlayer";

export class Level5 implements Level {
    constructor() {}

    createGroundTexture(size: Vector2): Promise<TiledTexture> {
        return TiledTexture.createFromPaths([RightNormalV3], size, new Vector2(64, 64), -1, true, true);
    }

    async createPlatform(x: number, y: number, width: number, height: number, friction: number, name: string) {
        return new StaticBody(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(width, height), 0b1, 0b1, friction, name)
            .addChild(new AABB(Vector2.zero(), new Vector2(width, height), true, name + "Collider"))
            .addChild(new TextureRect(Vector2.zero(), new Vector2(width, height), await this.createGroundTexture(new Vector2(width, height)), name + "Texture"))
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

    async createRegion(x: number, y: number, width: number, height: number, name: string, color: string) {
        return new Region(new Vector2(x, Utils.GAME_HEIGHT - y), new Vector2(width, height), 0b1, 0b1, name)
            .addChild(new AABB(Vector2.zero(), new Vector2(width, height), true, name + "collider"))
            .addChild(this.createColorRect(width, height, color, name + "Texture"));
    }

    public async getGameObjects(): Promise<GameObject[]> {
        return [
            // Frame
            await this.createPlatform(0, Utils.GAME_HEIGHT, Utils.GAME_WIDTH, 64, 0.8, "frameTop"),
            await this.createPlatform(0, Utils.GAME_HEIGHT - 64, 64, Utils.GAME_HEIGHT - 64, 9.8, "frameLeft"),
            await this.createPlatform(Utils.GAME_WIDTH - 64, Utils.GAME_HEIGHT - 64, 64, Utils.GAME_HEIGHT - 64, 0.8, "frameRight"),
        
            // Ladder
            await this.createPlatform(64, 832, 256, 64, 0.8, "ladderGoalPlatform"),
            await this.createTogglePlatform(320, 832, 256, 64, 1, "ladderTopToggle", "#0EFFF6"),
            await this.createPlatform(576, 832, 64, 64, 0.8, "ladderPlatformTop"),
            
            await this.createPlatform(576, 640, 64, 640, 0.8, "ladderSide"),

            await this.createPlatform(320, 640, 256, 64, 0.8, "ladderFirstRung"),
            await this.createTogglePlatform(64, 640, 256, 64, 2, "ladderFirstToggle", "#ffff00"),
            await this.createLever(64, 704, 64, 64, 3, "purpleLever", "#8c2fd4"),
            
            await this.createPlatform(64, 384, 256, 64, 0.8, "ladderSecondRung"),
            await this.createTogglePlatform(320, 384, 256, 64, 3, "ladderSecondToggle", "#8c2fd4"),

            await this.createTogglePlatform(64, 128, 512, 64, 4, "ladderBottom", "#ff0000"),
            await this.createButton(512, 192, 64, 64, 4, "redButton", "#f04d4d"),

            // Ladder side levers
            await this.createLever(512, 704, 64, 64, 2, "yellowLever", "#ffff00"),
            await this.createTogglePlatform(576, 768, 64, 128, 4, "sideToggle", "#ff0000"),

            await this.createPlatform(640, 448, 256, 64, 0.8, "sidePlatform"),

            // Chimney
            await this.createPlatform(1536, 1024, 64, 128, 0.8, "stopper"),

            await this.createPlatform(1536, 640, 64, 640, 0.8, "chimneySide"),
            await this.createTogglePlatform(1600, 640, 256, 64, 1, "chimneyTop", "#0efff6"),
            await this.createButton(1792, 704, 64, 64, 1, "blueButton", "#0dcbc4"),

            // Goal Area
            await this.createTogglePlatform(256, 1024, 64, 192, 4, "goalGate", "#ff0000"),
            await this.createRegion(64, 1024, 192, 192, "endBox", "orange"),

            // Players
            new Player(new Vector2(384, 128))
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "playerCollider"))
                .addChild(new TextureRect(Vector2.zero(), new Vector2(128, 128), await ImageTexture.createFromPath(RightNormalV3, new Vector2(128, 128)), "playerTexture")),

            new SquarePlayer(new Vector2(704, 576), "squarePlayer")
                .addChild(new AABB(Vector2.zero(), new Vector2(128, 128), true, "squarePlayer"))
                .addChild(this.createColorRect(128, 128, "#00ff00", "squarePlayerTexture")),
        ];
    }
}