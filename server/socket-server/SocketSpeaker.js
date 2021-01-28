const ClientManager = require('./ClientManager');
const LobbyManager = require('./LobbyManager');
const Lobby = require('./Lobby');
const Game = require('./Game');
const fs = require('fs')

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
	}

	erase_name(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			client.name = undefined;
			client.send('update_name');
		}
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
			let lobby_ = LobbyManager.getLobbyByClient(client);
			let lobby;

			if (lobby_)
			{
				let is_host = lobby_.host.key == key;
				lobby = { title: lobby_.title, max_players: lobby_.max_players, is_host }
			}

			client.send('status', { lobby, name: client.name } )
			if (lobby_)
			{
				this.update_players(client, lobby_);
			}
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

				this.set_lobby_events(lobby);

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
	set_lobby_events(lobby)
	{
		lobby.on('player_connected', (new_player) => {
			/*
			for(let client in lobby.clients)
			{
				this.update_players(lobby.clients[client], lobby);
			}
			*/
			for(let client in lobby.clients)
			{
				this.add_player(lobby.clients[client], new_player)
			}

		})
		lobby.on('lobby_client_kicked', (client) => {

			client.send('kicked_from_lobby')

		});
		lobby.on('start_game', function() {
			console.log( this, 123 );
		}.bind(lobby))

		lobby.on('lobby_upload_pack_start', function() {
			this.packState = 'uploading';
			if (this.packFolder) {
				fs.rmSync( this.packFolder );
			}
		}.bind(lobby))

		lobby.on('lobby_upload_pack_end', function() {
			this.packState = 'ready';
		}.bind(lobby))

	}
	connect_lobby(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let title = msg.data.title;

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
					let is_host = lobby.host.key == key;
					client.send('lobby_connected', { title : lobby.title, max_players: lobby.max_players, code, is_host });
					this.update_players(client, lobby);
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

	update_players(client, lobby)
	{
		let players = lobby.clients;

		let arr = [];

		for(let p in players)
		{
			let player = players[p];
			let is_host = lobby.host.key == player.key;
			arr.push({
				name: player.name,
				score: lobby.scores[player.key],
				is_host: is_host,
				//etc...
			})

			client.send('lobby_players', { players: arr } );
		}
	}
	add_player(client, new_client)
	{

		let lobby = LobbyManager.getLobbyByClient(client);

		if (lobby)
		{
			let is_host = lobby.host.key == new_client.key;
			client.send('lobby_add_player', { player:
				{
					name: new_client.name,
					score: lobby.scores[new_client.key],
					is_host
				}
			});
		}
	}
	lobby_kick_player(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let lobby = LobbyManager.getLobbyByClient(client);
			if (lobby)
			{
				if (client.key == lobby.host.key)
				{
					let kick_name = msg.data.name;

					lobby.kickClientByName(kick_name)

				}
			}
		}
	}

	lobby_start_game( ws, msg ) {
		const client = ClientManager.getClient( msg.key );
		const lobby = LobbyManager.getLobbyByClient(client);
		const is_host = lobby.host.key == client.key;
		const pack_uploaded = lobby.packState === 'ready';
		if ( is_host && pack_uploaded )
			lobby.emit('start_game');
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
			"lobby_kick_player" : "lobby_kick_player",
			"erase_name" : "erase_name",
			"lobby_start_game" : "lobby_start_game",
		}
	}
}