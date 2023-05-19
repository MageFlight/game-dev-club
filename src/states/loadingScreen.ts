import { GameState } from "merlin-game-engine/dist/gameState";
import LoadingImage from "../../assets/loadingScreen/loadingSpiral.svg";
import { ImageTexture } from "merlin-game-engine/dist/resources/textures";
import { ResourceLoader } from "merlin-game-engine/dist/resources/resource";
import { Vector2 } from "merlin-game-engine/dist/math/vector2";
import { Utils } from "merlin-game-engine/dist/utils";
import { log, renderer } from "merlin-game-engine";
import { Transform } from "merlin-game-engine/dist/math/transform";



export class LoadingScreen extends GameState {
  private loadingScreenImage?: ImageTexture;
  private cirlceRotation: number;

  constructor() {
    super();
    this.cirlceRotation = 0;
  }

  async load() {
    this.loadingScreenImage = await ImageTexture.createFromImage(await ResourceLoader.getImage(LoadingImage), LoadingImage);
    this.loadingScreenImage.size = new Vector2(200, 200);
  }

  override update(dt: number) {
    this.cirlceRotation = (this.cirlceRotation + dt / 100) % (2 * Math.PI);
  }

  override draw() {
    //background
    renderer.fillRect(Vector2.zero(), new Vector2(Utils.GAME_WIDTH, Utils.GAME_HEIGHT), "#09e6a0");
    //spin circle
    if (this.loadingScreenImage === undefined) return;

    log("GameWidth / 2: ", Utils.GAME_WIDTH / 2);
    const x = ((Utils.GAME_WIDTH - this.loadingScreenImage.size.x)/2) * renderer.getScaleFactor();
    const y = ((Utils.GAME_HEIGHT - this.loadingScreenImage.size.y)/2) * renderer.getScaleFactor();
    const originalTransform = renderer.getTransform();
    renderer.setTransform(
      Math.cos(this.cirlceRotation),
      Math.sin(this.cirlceRotation),
      -Math.sin(this.cirlceRotation),
      Math.cos(this.cirlceRotation),
      x + this.loadingScreenImage.size.x / 2,
      y + this.loadingScreenImage.size.y / 2
    );
    renderer.fillRect(new Vector2(-this.loadingScreenImage.size.x / 2, -this.loadingScreenImage.size.y / 2).divide(renderer.getScaleFactor()), this.loadingScreenImage.size, "#000000");
    renderer.setTransform(originalTransform);
    //renderer.fillRect(Vector2.zero(), new Vector2(5, 5), "#ff00ff");
    //renderer.fillRect(this.loadingScreenImage.size.multiply(0.5), new Vector2(5, 5), "#ff00ff");
    //renderer.fillRect(this.loadingScreenImage.size, new Vector2(5, 5), "#ff00ff");
    renderer.fillText(new Vector2(200, 200),"This is a loading screen:)", 50, "#000000")
  }
}