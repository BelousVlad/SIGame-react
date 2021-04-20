//TODO
const event = require('events');
const GameData = require('./GameData');

class Game {
	constructor()
	{
		this.regsitered_messages = [];
		this.game_info = new GameData();
	}

	setFileLoaderModule(value)
	{
		this.files_loader = value;
	}

	loadFile(file) //TODO
	{
		return this.files_loader.loadToClientsFile(file)
		.then(() => {

			console.log('LOOOOOOOOOOOOOOG');
		}); // данная функция должна возвращать промис
	}

	sendRoundInfo()
	{
		let obj = this.pack_controller.getPackageTemplateWithPrices();

		obj = obj[this.game_info.current_round];

		// for(let theme of obj)
		// {
		// 	for(let i = 0; i < theme.length; ++i)
		// 	{

		// 	}
		// }


		this.lobby.sendForClients('show_round_info', obj)

	}

	start()
	{
		this.emit('game_started');
		this.game_info.current_round = 0;
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

	getPackController()
	{
		return this.pack_controller;
	}

	setPackController(controller)
	{
		this.pack_controller = controller;
		this.game_info.setQuestionUsedByTemplate(controller.getPackgeTemplate());
	}

	getRandomQuestion()
	{
		this.pack_controller.getRandomQuestion( this.game_info.is_question_used );
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