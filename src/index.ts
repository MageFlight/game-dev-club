import { MerlinEngine } from "merlin-game-engine/dist";
import { TestGame } from "./test";

const engine = new MerlinEngine();
const game = new TestGame();
game.load().then(() => {
  engine.pushState(game);
  engine.start();
});
