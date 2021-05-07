const DomainController = require('./DomainController');
const LobbyManager = require('./../Lobby/LobbyManager');
const Lobby = require('./../Lobby/Lobby');
const ClientManager = require('./../ClientManager');


class LobbyController extends DomainController{
	constructor()
	{
		super({
			'get_lobbies' : 'get_lobbies',
			'create_lobby' : 'create_lobby',
			'connect_lobby' : 'connect_lobby',
			'get_lobby_id' : 'get_lobby_id'
		})
	}

	get_lobbies(ws, msg)
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
			let isTitleFree = ! LobbyManager.lobbies[title];

			if ( !isTitleFree ) {
				client.send( 'lobby_create' , { code : LobbyManager.LOBBY_NAME_ALREADY_EXIST });
				return;
			}

			if (!LobbyManager.isPlayerIntoLobby(client))
			{
				let lobby = LobbyManager.createLobby(title, password, max);
				client.send('lobby_create', { title : lobby.title, code: LobbyManager.LOBBY_CREATED_OK });

				// this.set_lobby_events(lobby);

				this.connect_lobby(ws, msg)
			}
			else
			{
				client.send('lobby_create', { code: LobbyManager.CLIENT_ALLREADY_INTO_LOBBY_ERROR });
			}
		}
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
					let lobby_ = { title : lobby.title, max_players: lobby.max_players, code, is_host }
					if (lobby.game) {
						lobby_.game = true;
					}

					client.send('lobby_connected', lobby_);
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

	get_lobby_id(ws, msg) {
		let key = msg.key;
		let client = ClientManager.getClient(key);
		let lobby = LobbyManager.getLobbyByClientKey(key);

		if (lobby)
			this.send(ws,'lobby_id', lobby.id);
	}

}

module.exports = LobbyController;