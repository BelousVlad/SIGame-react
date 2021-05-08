class ServerResponseManager {
	constructor(app)
	{
		this.app = app;
	}

	set_key(msg)
	{
		Cookie.set("key", msg.data);
	}

	lobby_list(msg)
	{
		this.app.view.showLobbyList(msg.data)
	}

	name_set_status(msg)
	{
		console.log(msg);
	}

	lobby_create(msg)
	{
		console.log(msg)
	}

	//there are methods for lobby processes

	lobby_game_question_resources(msg)
	{
		var data = msg && msg.data || undefined;

		//TODO
	}

	update_players(msg)
	{
		if (msg.data)
		{
			app.lobby.players = msg.data;
		}
	}

	status(msg)
	{

		if (msg.data.lobby)
		{
			this.lobby_connected({ data: {
					code: 200,
					lobby: msg.data.lobby
				}
			})
		}
		console.log(msg)
	}

	lobby_connected(msg)
	{
		let code = msg.data.code;
		if (code == 200)
		{
			if (document.location.pathname !== '/lobby')
				document.location.href = '/lobby'
			else
			{
				app.lobby = msg.data.lobby;
			}
		}
	}

	lobby_id_collected(msg) {
		let lobbyId = parseInt( msg.data );
		console.log(lobbyId);
	}

	show_round_info(msg) {
		// msg.data is object which looks like {themes: [...], prices: [...]}
		this.app.view.viewRoundInfo(msg.data);
	}

}