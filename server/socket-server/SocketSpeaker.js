const ClientManager = require('./ClientManager');
const LobbyManager = require('./LobbyManager');

module.exports = class SocketSpeaker{

	constructor()
	{
	}

	answer(ws, msg)
	{
		msg = JSON.parse(msg);

		for(let route in SocketSpeaker.routes)
		{
			if (msg.action == route)
				this[SocketSpeaker.routes[route]]( ws, msg );
		}
	}

	ping(ws, msg)
	{
		ws.send(JSON.stringify({action: "ping", data: "pong"}));
	}

	set_name(ws, msg)
	{
		let name = msg.data;
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			client.name = name;
			client.send('update_name', name);
		}
		console.log(ClientManager.clients);
	}
	send_key(ws, msg)
	{
		let key = msg.data;

		//console.log(msg);

		if (key != "0") // Игрок имеет ключ
		{
			let client = ClientManager.getClient(key);
			if (client == undefined)
			{
				let key = ClientManager.createClient();
				let client = ClientManager.getClient(key);
				client.addSocket(ws);
				this.send( ws, "set_key", key );
			}
			else
			{
				client.addSocket(ws);
			}
			//console.log(ClientManager.clients);
		}
		else
		{
			let key = ClientManager.createClient();
			let client = ClientManager.getClient(key);
			client.addSocket(ws);
			this.send( ws, "set_key", key);
		}
	}
	create_lobby(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let title = msg.data.title;
			let max = msg.data.max_players;
			let password = msg.data.password;

			if (!LobbyManager.isPlayerIntoLobby(client))
			{
				let lobby = LobbyManager.createLobby(title, password, max);
				let code = LobbyManager.addClientToLobby(lobby, client);

				console.log(lobby);

				client.send('lobby_created', { id : lobby.id, code: LobbyManager.LOBBY_CREATED_OK });
				client.send('lobby_connected', { id : lobby.id, code });
			}
			else
			{
				console.log(LobbyManager.CLIENT_ALLREADY_INTO_LOBBY_ERROR);
				client.send('lobby_created', { code: LobbyManager.CLIENT_ALLREADY_INTO_LOBBY_ERROR });
			}


			console.log(LobbyManager.lobbies);

		}
	}
	connect_lobby(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let code = LobbyManager.addClientToLobby(lobby, client);

			client.send('lobby_connected', { id : lobby.id, code });
		}
	}

	send(ws, action ,data)
	{
		ws.send(JSON.stringify({action, data}))
	}


	static get routes()
	{
		return {
			"ping" : "ping",
			"key" : "send_key",
			"set_name" : "set_name",
			"create_lobby" : "create_lobby",
			"connect_lobby" : "connect_lobby",
		}
	}
}