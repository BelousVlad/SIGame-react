const WebSocket = require('ws');
const event = require('events');

class Lobby extends event {

	constructor( title, max_p, password )
	{
		this.clients = new Object();
		this.max_players = max_p ;
		this.title = title ;
		this.password = password ;
	}

	hasClient( client )
	{
		this.clients.find(  )
	}

	addClient(client)
	{
		let clientKey = client.key;

		if ( Object.keys( this.clients ).length < this.max_players)
		{
			this.clients[clientKey] = client ;
			return Lobby.CLIENT_CONNECT_TO_LOBBY_OK;
		}
		else
		{
			return Lobby.MAX_PLAYERS_ERROR;
		}
	}

	removeClient( client )
	{
		let clientKey = client.key;

		client.emit('die');
		this.clients[ clientKey ] = undefined;
	}

	static get CLIENT_CONNECT_TO_LOBBY_OK()
	{
		return 200;
	}
	static get MAX_PLAYERS_ERROR()
	{
		return 400;
	};
	static get CLIENT_REMOVE_FROM_LOBBY_OK()
	{
		return 201;
	}
	static get NO_SUCH_CLIENT_IN_LOBBY_ERROR()
	{
		return 402;
	}
}

module.exports = Lobby;