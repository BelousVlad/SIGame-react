class Router{
	get routes()
	{
		return {
			"ping" : "ping",
			"set_key" : "setKey",
			"update_name" : "updateName",
			"status" : "updateStatus",
			"lobby_create" : "lobby_create",
			"lobby_connected" : "lobby_connected",
			"lobby_list" : "lobby_list",
			"lobby_players" : "updateLobbyPlayers",
			"lobby_add_player" : "addLobbyPlayer",
			"lobby_remove_player" : "lobbyRemovePlayer",
			"lobby_kick_player" : "lobby_kick_player",
			"kicked_from_lobby" : "kicked_from_lobby",
			"show_round" : "showRound",
			"lobby_chat_get_message" : "lobbyChatGetMessage",
			"lobby_changed_player_score" : "lobbyChangedPlayerScore",
			"lobby_master_set" : "lobbyMasterSet",
			"name_set_succed" : "nameSetSucced",
			"display_error" : "displayError",

			"refresh_page" : "refresh_page",

			"name_set_failed" : "nameSetFailed",
			"lobby_create_failed" : "lobbyCreateFailed",
			"avatar_set_succeed" : "avatarSetSucceed",
			"receive_lobby_configuration" : "receiveLobbyConfiguration",
			"file" : "test_file", //TODO test route
		};
	}

	getServerMessage(message)
	{
		let ans = JSON.parse(message);
		app[this.routes[ans.action]](ans);
	}
}