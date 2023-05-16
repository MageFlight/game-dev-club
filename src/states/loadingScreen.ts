import { GameState } from "merlin-game-engine/dist/gameState";
import LoadingImage from "../../assets/loadingScreen/dontReadThis.png";
import { ImageTexture } from "merlin-game-engine/dist/resources/textures";
import { ResourceLoader } from "merlin-game-engine/dist/resources/resource";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Utils } from "merlin-game-engine/dist/utils";

export class LoadingScreen extends GameState {
  private loadingScreenImage?: ImageTexture;

  constructor() {
    super();
  }

  async load() {
    this.loadingScreenImage = await ImageTexture.createFromImage(await ResourceLoader.getImage(LoadingImage), LoadingImage);
    this.loadingScreenImage.size = new Vector2(Utils.GAME_WIDTH, Utils.GAME_HEIGHT);
  }

  override update(dt: number) {
    
  }

  override draw() {
    this.loadingScreenImage?.draw(Vector2.zero());
  }
}

