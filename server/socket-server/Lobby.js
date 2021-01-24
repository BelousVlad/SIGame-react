const WebSocket = require('ws');
const event = require('events');

class Lobby{

	constructor( title, max_p, password )
	{
		Object.assign( this, new event() ) // 1-st step of mix-in of events

		this.clients = new Object();
		this.max_players = max_p ;
		this.title = title ;
		this.password = password ;
	}

	hasClient( client )
	{
		return !!this.clients.find( item => { return item.key == client.key } );
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

Object.assign( Lobby.prototype, event.prototype ) // 2-nd step of mix-in of event

module.exports = Lobby;