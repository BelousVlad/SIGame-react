const GameModule = require('../GameModule');
const IFileLoader = require('./IFileLoader');

class AbstractFileLoader extends GameModule {
	constructor(lobby, game)
	{
		super(lobby, game);
	}
}

Object.assign(AbstractFileLoader.prototype, IFileLoader.prototype); //IMPLEMETS

module.exports = AbstractFileLoader;