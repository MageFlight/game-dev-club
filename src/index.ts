//imports the engine
import { MerlinEngine } from "merlin-game-engine/dist";
//grabs constructors from testGame file
import { TestGame } from "./states/testGame";


//adds engine into the file
const engine = new MerlinEngine();

const testGame = new TestGame();

//loads the game object into the browser
testGame.load().then(() => {
  engine.pushState(testGame);
  engine.start();
});




