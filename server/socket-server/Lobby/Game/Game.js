//TODO
const event = require('events');

class Game {
	constructor(conductor, files_loader, question_putter)
	{
		this.files_loader = files_loader //TODO
		this.question_putter = question_putter //TODO
		this.conductor = conductor //TODO

		this.regsitered_messages = [];
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
		this.conductor.turn();
	}

	file_sended(args)
	{
		this.files_loader.files_sended(args);
	}

	questionChoosed(client, question)
	{
		this.emit('question-choosed', client, question);
	}

	registerModuleMessage(action_message, module, func)
	{
		this.regsitered_messages.push({ message: action_message, module, function: func });
	}

	moduleMessage(ws, msg)
	{
		let action = msg.data.action_module;

		for(let message of this.regsitered_messages)
		{
			if (message.message === action)
				message.function.bind(message.module)(ws, msg);
		}
	}



}

Object.assign( Game.prototype, event.prototype )

module.exports = Game;