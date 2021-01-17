const Lobby = require('./Lobby');


class LobbyManager{


	constructor()
	{
		this.lobbies = [];
		this.id_increamenter = 0;
	}

	generateId()
	{
		return this.id_increamenter++;
	}

	createLobby(title, password, max_p)
	{
		let id = this.generateId();
		let lobby = new Lobby(id, title, max_p, password)
		this.lobbies.push(lobby);
		return lobby;
	}

	isPlayerIntoLobby(client)
	{
		for(let lobby of this.lobbies)
		{
			//console.log(lobby + " lobby")
			for(let client_ of lobby.clients)
			{
				//console.log("client " + client.key + " " + client_.key + " " + client.key == client_.key)
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
		console.log(is);
		if (is)
		{
			return LobbyManager.CLIENT_ALLREADY_INTO_LOBBY_ERROR;
		}
		return lobby.addClient(client);
	}

	getLobbyById(id)
	{
		for(let lobby in this.lobbies)
		{
			if (lobby.id == id)
		 	{
		 		return lobby;
		 	}
		}
	}

	get LOBBY_CREATED_OK()
	{
		return 201;
	}

	get CLIENT_ALLREADY_INTO_LOBBY_ERROR()
	{
		return 401;
	}
}

const manager = new LobbyManager();

module.exports = manager;