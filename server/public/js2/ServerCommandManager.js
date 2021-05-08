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
		this.send('lobby.get_lobbies');
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

	choiceQuestion(theme_id, question_id)
	{
		this.send('lobby.choice_question', { theme_id, question_id });
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