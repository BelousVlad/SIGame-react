class ServerCommandManager {
	constructor(speaker)
	{
		this.speaker = speaker;
	}

	sendKey()
	{
		this.send("client.key", this.key)
	}

	setName(name)
	{
		this.send("client.name", name)
	}

	getLobbies()
	{
        this.sendWithoutKey('lobby.get_lobbies');
	}

	connetLobby(id, password)
	{
		this.sendWithKey('lobby.connect_lobby', { id, password })
	}

	createLobby(title , max_players, password)
	{
		this.send('lobby.create_lobby', { title, max_players, password });
	}

	getLobbyId()
	{
		this.send('lobby.get_lobby_id');
	}

	becameMaster()
	{
		this.send('lobby.became_master');
	}

	stopBeMaster()
	{
		this.send('lobby.stop_master');
	}

	startLobbyGame()
	{
		this.send('lobby.start_game');
	}

	choiceQuestion(theme_index, question_index)
	{
		this.send('lobby.game.choice_question', { theme_index, question_index });
	}

	askToReply()
	{
		this.send('lobby.game.ask_to_reply');
	}

	makeBet(value)
	{
		this.send('lobby.game.make_bet', {bet: value});
	}

	sendReady()
	{
		this.send('lobby.game.client_ready');
	}

	sendQuestionAnswer(ans)
	{
		this.send('lobby.game.question_answer', { answer: ans })
	}

	playerEvaluationAnswer(name, mark)
	{
		this.send('lobby.game.question_evaluation', { name, mark })
	}

    nextRound()
	{
        this.send('lobby.game.next_round')
	}
	sendChatMessage(text)
	{
		this.send('lobby.send_chat_message', { text });
	}

	skipStage()
	{
		this.sendWithKey('lobby.game.skip_stage');
	}

	lobbyLeave()
	{
		this.send('lobby.leave_from_lobby');
	}

	//Дальше идут служебные методы (приватные)

	send(action, data)
	{
		let key = this.key;
		if (key != undefined && key != "0")
		{
            this.sendWithKey(action, data);
		}
		else
		{
            this.sendWithoutKey(action, data);
		}
	}

	kick_player(name)
	{
		this.send('lobby.kick_player', { name: name });
	}

	lobbyChangePlayerScore(name, score)
	{
		this.send('lobby.game.change_score', { player_name: name, score })
	}

	sendWithKey(action ,msg)
	{
		this.speaker.send({action, key: this.key ,data: msg})
	}
	sendWithoutKey(action ,msg)
	{
		this.speaker.send({action, data: msg})
	}

	get key()
	{
		return Cookie.get('key') ?? "0";
	}
}