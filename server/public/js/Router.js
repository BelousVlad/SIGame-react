class Router{
	get routes()
	{
		return {
			"ping" : "ping",
			"set_key" : "setKey",
			"update_name" : "updateName",
			"status" : "updateStatus",
			"lobby_created" : "lobby_created",
			"lobby_connected" : "lobby_connected",
			"lobby_list" : "lobby_list",
			"lobby_players" : "updateLobbyPlayers",
			"lobby_add_player" : "addLobbyPlayer",
			"lobby_kick_player" : "lobby_kick_player",
			"kicked_from_lobby" : "kicked_from_lobby",
			"show_round" : "showRound",
		};
	}

	getServerMessage(message)
	{
		let ans = JSON.parse(message);
		app[this.routes[ans.action]](ans);
	}
}