class ServerSpeakerController{

	constructor(){
		this.speaker = new ServerSpeaker();
	}

	setName(name)
	{
		this.send("set_name", name);
	}

	eraseName()
	{
		this.send('erase_name');
	}

	sendClientKey(key)
	{
		this.send("key", this.key)
	}

	getLobbyList()
	{
		this.send("lobby_list")
	}

	start()
	{
	    this.speaker.openSocket();
	}

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

	connectToLobby(title, password)
	{
		this.sendWithKey('connect_lobby', { title, password })
	}
	createLobby(title , max_players, password)
	{
		this.sendWithKey("create_lobby", {title , max_players, password })
	}
	kick_player(name)
	{
		this.sendWithKey("lobby_kick_player", { name: name })
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