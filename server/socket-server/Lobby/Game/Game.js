//TODO
const event = require('events');


class Game {
	constructor(lobby)
	{
		this.lobby = lobby;
		this.regsitered_messages = [];
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

	getRoundInfo()
	{
		let prices = this.pack_controller.getPackageTemplateWithPrices();

		prices = prices[this.game_info.current_round];
		let themes = this.pack_controller.getThemesTitles(this.game_info.current_round);
		return { themes, prices };
	}

	sendRoundInfo(client)
	{
		client.send('show_round_info', this.getRoundInfo());
	}

	sendRoundInfoClients()
	{
		for(let cl in this.lobby.clients)
		{
			this.sendRoundInfo(this.lobby.clients[cl]);
		}
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
		this.game_info.setQuestionUsedByTemplate(controller.getPackageTemplate());
	}

	getRandomQuestion()
	{
		return this.pack_controller.getRandomQuestion( this.game_info.is_question_used, this.game_info.current_round );
	}

	getQuestion(theme_index, question_index)
	{
		return question = this.pack_controller.getItemByIndexes(this.game_info.current_round, theme_index, question_index);
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

	getGameStatus()
	{
		let obj = {}
		obj.round_info = this.getRoundInfo();
		//TODO
		return obj;
	}


}

Object.assign( Game.prototype, event.prototype )

module.exports = Game;