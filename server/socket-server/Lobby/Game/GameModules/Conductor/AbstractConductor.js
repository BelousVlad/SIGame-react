const GameModule = require('../GameModule');

class AbstractConductor extends GameModule {
	constructor(lobby, game)
	{
		super(lobby, game);
	}

	turn()
	{
		
	}

}

module.exports = AbstractConductor;
