import { GameObject } from "merlin-game-engine/dist/gameObjects/gameObject";

export interface Level {
    getGameObjects(): Promise<GameObject[]>
}