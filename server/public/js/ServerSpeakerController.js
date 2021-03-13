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

	startGame()
	{
		this.send('lobby_start_game');
	}

	getRound() {
		this.send('get_pack_round')
	}

	nextRound() {
		this.send('lobby_game_next_round')
	}

	previousRound() {
		this.send('lobby_game_previous_round')
	}

	sendChatMessage(text)
	{
		this.sendWithKey('lobby_chat_send_msg', { text: text })
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

	setScorePlayer(player_name, score)
	{
		this.sendWithKey('lobby_score_change', {
			player_name: player_name,
			score: score
		})
	}

	becomeMaster()
	{
		this.sendWithKey('lobby_become_master')
	}

	leave_from_lobby()
	{
		this.sendWithKey('lobby_leave')
	}

	stopMaster()
	{
		this.sendWithKey('stop_be_master');
	}

	sendWithKey(action ,msg)
	{
		this.speaker.send({action, key: this.key ,data: msg})
	}
	sendWithoutKey(action ,msg)
	{
		this.speaker.send({action, data: msg})
	}

	getStatus()
	{
		this.speaker.send( { action: 'status', data : {}, key : this.key } );
	}

	get key()
	{
		return Cookie.get('key') ?? "0";
	}
}