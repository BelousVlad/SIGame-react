//TODO

class Game {
	constructor()
	{
		this.files_loader = {} //TODO
	}

	setFileLoaderModule(value)
	{
		this.files_loader = value;
	}

	loadFile(file) //TODO
	{
		console.log(6);

		return this.files_loader.loadToClientsFile(file)
		.then(() => {

			console.log('LOOOOOOOOOOOOOOG');
		}); // данная функция должна возвращать промис
	}

	start()
	{
		console.log(5);

		this.loadFile('test_file');
	}

	file_sended(args)
	{
		this.files_loader.files_sended(args);
	}

}

module.exports = Game;