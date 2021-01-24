const Lobby = require('./Lobby');


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
			for(let client_ of this.lobbies[lobby].clients)
			{
				if(client.key == client_.key)
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
		let is = this.isPlayerIntoLobby(client);
		if (!is)
		{
			return LobbyManager.NO_SUCH_CLIENT_IN_LOBBY_ERROR;
		}
		return lobby.removeClient(client);
	}

	getLobbyByTitle( title )
	{
		for(let lobby in this.lobbies)
		{
			if (lobby === title)
		 	{
		 		return lobby;
		 	}
		}
		return undefined;
	}

	getLobby( lobby )
	{
		if ( typeof lobby === 'string' )
		{
			return this.getLobbyByTitle( lobby );
		}
		else if ( typeof lobby === 'object' && lobby instanceof Lobby )
		{
			return this.getLobbyByTitle( lobby.title );
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

	get NO_SUCH_CLIENT_IN_LOBBY_ERROR() // TODO get valid error value
	{
		return 402;
	}
}

const manager = new LobbyManager();

module.exports = manager;