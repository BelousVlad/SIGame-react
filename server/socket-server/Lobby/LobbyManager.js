const Lobby = require('./Lobby');
const ClientManager = require('../ClientManager');

class LobbyManager{


	constructor()
	{
		this.lobbies = new Object();
	}

	createLobby(title, password, max_p)
	{
		let lobby = new Lobby(title, max_p, password);
		this.lobbies[title] = lobby;
		return lobby;
	}

	isPlayerIntoLobby(client)
	{
		for(let lobby in this.lobbies)
		{
			for(let client_ in this.lobbies[lobby].clients)
			{
				if(client.key == client_)
				{
					return true;
				}
			}
		}
		return false;
	}

	addClientToLobby(lobby, client)
	{
		let is = this.isPlayerIntoLobby(client);
		if (is)
		{
			return LobbyManager.CLIENT_ALLREADY_INTO_LOBBY_ERROR;
		}
		return lobby.addClient(client);
	}

	removeClientFromLobby(lobby, client)
	{
		let is = lobby.hasClient(client);
		if (!is)
		{
			return Lobby.NO_SUCH_CLIENT_IN_LOBBY_ERROR;
		}
		return lobby.removeClient(client);
	}

	getLobbyByClient(Client)
	{
		for(let lobby in this.lobbies)
		{
			if (this.lobbies[lobby].hasClient(Client))
		 	{
		 		return this.lobbies[lobby];
		 	}
		}
		return undefined;
	}

	getLobbyByClientKey( key )
	{
		return this.getLobbyByClient( ClientManager.getClient(key) );
	}

	getLobbyByTitle(title)
	{
		for(let lobby in this.lobbies)
		{
			if (lobby === title)
		 	{
		 		return this.lobbies[lobby];
		 	}
		}
		return undefined;
	}

	getLobby( fitler )
	{
		if ( typeof fitler === 'string' )
		{
			return this.getLobbyByTitle( fitler );
		}
		else if ( typeof fitler === 'object' && fitler instanceof Lobby )
		{
			return this.getLobbyByTitle( fitler.title );
		}
		else if ( typeof fitler === 'object' && fitler instanceof Client )
		{
			return this.getLobbyByClient( fitler );
		}
		else
		{
			throw `invalid lobby value ${lobby}`;
		}
	}

	deleteLobby( lobby ){
		let title = lobby.title;

		lobby.emit('die');
		this.lobbies[title] = undefined;
	}

	get LOBBY_CREATED_OK()
	{
		return 201;
	}

	get CLIENT_ALLREADY_INTO_LOBBY_ERROR()
	{
		return 401;
	}
	get NO_SUCH_LOBBY()
	{
		return 403
	}
}

const manager = new LobbyManager();

module.exports = manager;