const WebSocket = require('ws');

module.exports = class Lobby{

	constructor(id, title, max_p, pass)
	{
		this.id = id;
		this.clients = [];
		this.map_players = max_p ;
		this.title = title ;
		this.password = pass ;
	}

	addClient(client)
	{
		if (this.clients.length < this.map_players)
		{
			this.clients.push(client);
			return Lobby.CLIENT_CONNECT_TO_LOBBY_OK;
		}
		else
		{
			return Lobby.MAX_PLAYERS_ERROR;
		}
	}
	static get CLIENT_CONNECT_TO_LOBBY_OK()
	{
		return 200;
	}
	static get MAX_PLAYERS_ERROR()
	{
		return 400;
	};
}