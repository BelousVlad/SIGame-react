const ClientManager = require('./ClientManager');
const LobbyManager = require('./Lobby/LobbyManager');
const Lobby = require('./Lobby/Lobby');
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
			let isNameFree = ! ClientManager.clients.find( item => item.name === name ) // в случае если имя занято на стороне клиента вызовется метод соотвуствующий руту name_set_failed
			if ( isNameFree ) {
				client.name = name;
				client.send('name_set_succed', name);
			} else {
				let reason = `name ${ name } alredy taken.`
				client.send('name_set_failed', {reason : reason} );
			}
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
				let is_master = lobby_.master ? lobby_.master.key == key : false;
				lobby = { title: lobby_.title, max_players: lobby_.max_players, is_host, is_master }
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
			let isTitleFree = ! LobbyManager.lobbies.find( item => item.title === title );

			if ( !isTitleFree ) {
				client.send( 'lobby_create_failed' ,{ reason : `lobby name already exist ${title}` });
				return;
			}

			if (!LobbyManager.isPlayerIntoLobby(client))
			{
				let lobby = LobbyManager.createLobby(title, password, max);
				client.send('lobby_created', { title : lobby.title, code: LobbyManager.LOBBY_CREATED_OK });

				this.set_lobby_events(lobby);

				this.connect_lobby(ws, msg)
			}
			else
			{
				client.send('lobby_created', { code: LobbyManager.CLIENT_ALLREADY_INTO_LOBBY_ERROR });
			}


			// console.log(LobbyManager.lobbies);

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

		lobby.on('lobby_client_score_changed', (client, score) => {
			for(let key in lobby.clients)
			{
				let cl = lobby.clients[key];

				cl.send('lobby_changed_player_score', {
					player_name: client.name,
					score: score
				});
			}
		});

		lobby.chat.on('lobby_chat_message_added', (message) => {
			this.lobby_chat_send_msg_to_clients(lobby, message)
		})

		lobby.on('lobby_client_removed', (deleted_client) => {
			for(let client in lobby.clients)
			{
				this.lobby_remove_player(lobby.clients[client], deleted_client)
			}
		})
		lobby.on('lobby_master_set', (master) => {
			for(let client in lobby.clients)
			{
				this.lobby_master_set(lobby.clients[client], master, lobby)
			}
		})
	}

	connect_lobby(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client && client.name )
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
			let is_master = lobby.master ? lobby.master.key == player.key : false;
			arr.push({
				name: player.name,
				score: lobby.scores[player.key],
				is_host: is_host,
				is_master: is_master,
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
	lobby_remove_player(client, deleted_client)
	{
		let lobby = LobbyManager.getLobbyByClient(client);

		if (lobby)
		{
			client.send('lobby_remove_player', { player:
				{
					name: deleted_client.name
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
    	let has_permission = lobby.master ? lobby.master.key == client.key : false;
		const pack_uploaded = lobby.packState === 'ready';
		// console.log(msg, lobby);
		if ( has_permission && pack_uploaded && !lobby.game )
			lobby.startGame()
	}

	send(ws, action ,data)
	{
		ws.send(JSON.stringify({action, data}))
	}

	get_pack_question( ws, msg ) {

        let client = ClientManager.getClient(msg.key),
        	lobby = LobbyManager.getLobbyByClient(client)

		if ( !lobby )
			return;

		this.send( ws, 'download_question', lobby.Game.current.question )
	}

	get_pack_round( ws, msg ) {
		let client = ClientManager.getClient(msg.key),
        	lobby = LobbyManager.getLobbyByClientKey(msg.key)

		if ( !(lobby && lobby.game && lobby.packState === 'ready' ) )
			return;

		this.send( ws, 'show_round', lobby.game.current.round);
	}



	lobby_game_next_round( ws, msg ) {
		let client = ClientManager.getClient(msg.key),
        	lobby = LobbyManager.getLobbyByClientKey(msg.key),
        	has_permission = lobby.master ? lobby.master.key == client.key : false;

		if ( !(lobby && lobby.game && lobby.packState === 'ready' ) || !has_permission )
			return;

		lobby.game.nextRound();
		this.get_pack_round( ws, msg );
	}

	lobby_game_previous_round( ws, msg ) {
		let client = ClientManager.getClient(msg.key),
        	lobby = LobbyManager.getLobbyByClientKey(msg.key),
        	has_permission = lobby.master ? lobby.master.key == client.key : false;

		if ( ! (lobby && lobby.game && lobby.packState === 'ready' ) || !has_permission )
			return;

		lobby.game.previousRound();
		this.get_pack_round( ws, msg );
	}

	lobby_chat_send_msg(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let lobby = LobbyManager.getLobbyByClient(client);
			if (lobby)
			{
				let text = msg.data.text
				lobby.chat.addMessage(client, text);
			}
		}
	}

	lobby_chat_send_msg_to_clients(lobby, message)
	{
		for(let c in lobby.clients)
		{
			lobby.clients[c].send('lobby_chat_get_message', {
				from: message.client.name,
				text: message.text
			})
		}
	}

	lobby_score_change(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let lobby = LobbyManager.getLobbyByClient(client);
			if (lobby)
			{
				if (lobby.master && client.key == lobby.master.key)
				{
					let change_client_name = msg.data.player_name;

					let change_client = lobby.getClientByName(change_client_name);

					if (change_client)
					{
						let score = Number(msg.data.score);

						if (!Number.isNaN(score))
							lobby.changeClientScore(change_client, score);
					}
				}
			}
		}
	}

	lobby_become_master(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);

		if (client)
		{
			let lobby = LobbyManager.getLobbyByClient(client);
			if (lobby)
			{
				lobby.setMaster(client)
			}
		}
	}

	lobby_master_set(client, master, lobby)
	{
		let is_host = lobby.host.key == master.key;
		//console.log(client)
		client.send('lobby_master_set', { 
			master_name: master.name,
			is_host: is_host,
			//etc...
		})		
	}

	displayError( text ) {
		this.send( ws, "display_error", text );
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
			"get_pack_question" : "get_pack_question",
			"get_pack_round" : "get_pack_round",
			"lobby_game_next_round" : "lobby_game_next_round",
			"lobby_game_previous_round" : "lobby_game_previous_round",
			"lobby_chat_send_msg" : "lobby_chat_send_msg",
			"lobby_score_change" : "lobby_score_change",
			"lobby_become_master" : "lobby_become_master",
		}
	}
}