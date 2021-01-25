const ClientManager = require('./ClientManager');
const LobbyManager = require('./LobbyManager');
const Lobby = require('./Lobby');

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
				this.status(ws,msg);
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

	// Отправка сведений о состоянии пользователя
	// Имя, параметры лобби
	status(ws, msg) 
	{
		let key = msg.key;

		let client = ClientManager.getClient(key)

		if (client)
		{
			let lobby = LobbyManager.getLobbyByClient(client);

			if (lobby)
			{
				lobby = { title: lobby.title, max_players: lobby.max_players }
			}

			client.send('status', { lobby, name: client.name } )
		}
		else
		{
			client.send('status', 0 )
		}
	}

	lobby_list(ws, msg)
	{
		let lobbies_ = LobbyManager.lobbies;

		let lobbies = [];

		for(let item in lobbies_)
		{
			let lobby = lobbies_[item];
			lobbies.push({
				title: lobby.title,
				max_players: lobby.max_players,
				players_count: Object.keys( lobby.clients ).length,
				is_password: Boolean(lobby.password)
			});
		}

		this.send(ws,'lobby_list', lobbies);
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
				client.send('lobby_created', { title : lobby.title, code: LobbyManager.LOBBY_CREATED_OK });

				msg.data.title = title;
				this.connect_lobby(ws, msg)
			}
			else
			{
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
			let title = msg.data.title;

			console.log(title)

			let lobby = LobbyManager.getLobbyByTitle(title)

			if (lobby)
			{
				let is_pass;
				if (lobby.password)
					is_pass = lobby.password === msg.data.password;
				else
					is_pass = true;

				if (is_pass)
				{
					let code = LobbyManager.addClientToLobby(lobby, client);
					client.send('lobby_connected', { title : lobby.title, max_players: lobby.max_players, code });
				}
				else
					client.send('lobby_connected', { title : lobby.title, max_players: lobby.max_players, code: Lobby.INCORRECT_PASSWORD });
			}
			else
			{
				client.send('lobby_connected', {  code: LobbyManager.NO_SUCH_LOBBY });
			}

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
			"lobby_list" : "lobby_list",
		}
	}
}