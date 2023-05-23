//imports the engine
import { MerlinEngine } from "merlin-game-engine/dist";
//grabs constructors from testGame file
import { TestGame } from "./states/testGame";
import { LoadingScreen } from "./states/loadingScreen";
import { Utils } from "merlin-game-engine/dist/utils";


//adds engine into the file
const engine = new MerlinEngine();


//creates game states
const testGame = new TestGame();
const loadingScreen = new LoadingScreen();

let loadsFinished = 0;

Utils.listen("showLoadingScreen", () => engine.pushState(loadingScreen))

Utils.listen("hideLoadingScreen", () => engine.popState());


function loadFinished() {
  loadsFinished++;
  
  if (loadsFinished == 2) {
    engine.pushState(testGame);
    engine.start();
  }
}

testGame.load().then(loadFinished);

//loads the game state into the browser
loadingScreen.load().then(loadFinished);





