class GameModule {
	constructor(lobby, game)
	{
		this.lobby = lobby;
		this.game = game;
	}

	registerModuleMessage(action, func)
	{
		this.game.registerModuleMessage(action, this, func);
	}

}

module.exports = GameModule;