const AbstractFileLoader = require('./AbstractFileLoader');

class BasicFileLoader extends AbstractFileLoader {
	constructor(lobby, game)
	{
		super(lobby, game);
		this.temp_load_obj = {};
	}

	//implements/override loadToClientsFile
	loadToClientsFile(file)
	{
		console.log(7);
		return new Promise((resolve, reject) => {
			console.log(8);
			this.lobby.sendForClients('file', { test: file })

			this.temp_load_obj.resolve = resolve,
			this.temp_load_obj.reject = reject;

		})
	}

	files_sended(args)
	{
		console.log(args);

		this.temp_load_obj.resolve(args);
	}

}

module.exports = BasicFileLoader;