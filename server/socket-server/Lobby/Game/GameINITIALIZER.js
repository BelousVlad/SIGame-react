const BasicFileLoader = require('./GameModules/FileLoader/BasicFileLoader');
const BasicConductor = require('./GameModules/Conductor/BasicConductor');
const PackController = require('./GameModules/PackController/PackController');
const BasicQuestionPutter = require('./GameModules/QuestionPutter/BasicQuestionPutter');
const GameData = require('./GameData');
const Game = require('./Game');

class GameInitializer {

	static createInstance()
	{
		return new GameInitializer();
	}

	createGame(config, lobby)
	{
		//TODO процесс сборки игры
		let game = new Game(lobby);
		let file_module = new BasicFileLoader(lobby);
		game.setFileLoaderModule(file_module);
		game.conductor = new BasicConductor(lobby, game);
		game.question_putter = new BasicQuestionPutter(lobby, game);
		game.setPackController(new PackController(lobby, game, lobby.pack));
		game.game_info = new GameData();

		return game;
	}

}

module.exports = GameInitializer;