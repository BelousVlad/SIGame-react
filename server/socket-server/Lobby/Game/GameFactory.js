const BasicFileLoader = require('./GameModules/FileLoader/BasicFileLoader');
const Game = require('./Game');

class GameFactory {

	static createInstance()
	{
		return new GameFactory();
	}

	createGame(config, lobby)
	{
		//TODO процесс сборки игры
		let game = new Game();
		let file_module = new BasicFileLoader(lobby);
		game.setFileLoaderModule(file_module);

		return game;
	}

}

module.exports = GameFactory;