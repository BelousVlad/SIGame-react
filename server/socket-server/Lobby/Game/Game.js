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

		}); // данная функция должна возвращать промис
	}

	getRoundInfo()
	{
		if (this.game_info.current_round !== undefined)
		{
			let prices = this.pack_controller.getPackageTemplateWithPrices(this.game_info.is_question_used);

			prices = prices[this.game_info.current_round];
			let themes = this.pack_controller.getThemesTitles(this.game_info.current_round);
			let round = this.pack_controller.getRound(this.game_info.current_round);
			let current_round_type = this.pack_controller.getRoundType(this.game_info.current_round);

			return { current_round_type, themes, prices, title: round.roundName, round_number: this.game_info.current_round};
		}
		return undefined;
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
		this.game_info.current_round = undefined;
		this.lobby.sendForClients('start_game', this.getGameStatus());
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

	getPackInfo()
	{
		let info = this.pack_controller.getPackInfo();
		return {
			authors: info.authorList
		}
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
		return this.pack_controller.getItemByIndexes(this.game_info.current_round, theme_index, question_index);
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

	clientReady(client)
	{
		this.conductor.clientReady(client);
	}

	askToReply(client)
	{
		this.conductor.askToReply(client);
	}

	getGameStatus(client)
	{
		let obj = {};
		obj.round_info = this.getRoundInfo();
		obj.current_process = this.conductor.getProcessInfo(client);
		//TODO
		return obj;
	}

	skip_stage()
	{
		this.conductor.skip_stage();
	}

	client_make_bet(client, bet)
	{
		this.conductor.clientMakeBet(client, bet);
	}

	client_reply(client, answer)
	{
		this.conductor.clientReply(client, answer);
	}

	evaluation_answer_client(master_client, client, mark)
	{
		if (this.lobby.master.key === master_client.key)
		{
			this.conductor.evaluationAnswerClient(client, mark);
		}
	}

	addScore(client, count)
	{
		this.game_info.scores[client.key] += count;
	}

	setScore(client, score)
	{
		this.game_info.scores[client.key] = score;
	}
	getQuestionLocation(question)
	{
		return this.pack_controller.getQuestionLocation(question);
	}
	setQuestionUsed(question)
	{
		let location = this.getQuestionLocation(question)
		this.setQuestionUsedByCoords(location.roundIndex,
							location.themeIndex,
							location.questionIndex)
	}
	setQuestionUsedByCoords(round, theme, question)
	{
		this.game_info.is_question_used[round][theme][question] = true;
	}

	// this method returns not a SIQuestion instances. it returns objects with properties themeIndex, questionIndex
	getLeftQuestions()
	{
		const result = new Array;

		this.game_info.is_question_used[this.game_info.current_round].forEach(
			(theme, themeIndex) => theme.forEach(
				(is_question_used, questionIndex) =>
					is_question_used ? undefined : result.push({themeIndex, questionIndex})
				)
		);

		return result;
	}

	getLeftQuestionsCount()
	{
		let counter = 0;
		this.game_info.is_question_used[this.game_info.current_round].forEach(theme => theme.forEach(is_question_used => counter += is_question_used ? 0 : 1));

		return counter;
	}

	getRoundType()
	{
		return this.pack_controller.getRoundType(this.game_info.current_round);
	}

    nextRound()
	{
	    console.log(!this.isLastRound());
	    if (!this.isLastRound())
		    this.conductor.nextRound()
	}
	isLastRound()
    {
        let round = this.getRoundInfo();

        return round.round_number >= this.game_info.round_count - 1;
    }
}

Object.assign( Game.prototype, event.prototype );

module.exports = Game;