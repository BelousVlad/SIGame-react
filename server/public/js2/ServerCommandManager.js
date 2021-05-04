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

	createLobby(title , max_players, password)
	{
		this.send('lobby.create_lobby', { title, max_players, password });
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