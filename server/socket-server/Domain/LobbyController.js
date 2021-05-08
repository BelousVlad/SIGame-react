const DomainController = require('./DomainController');
const GameController = require('./GameController');
const LobbyManager = require('./../Lobby/LobbyManager');
const Lobby = require('./../Lobby/Lobby');
const ClientManager = require('./../ClientManager');
const DomainRouter = require('./DomainRouter');


class LobbyController extends DomainController {
	constructor()
	{
		super({
			'get_lobbies' : 'get_lobbies',
			'create_lobby' : 'create_lobby',
			'connect_lobby' : 'connect_lobby',
			'get_lobby_id' : 'get_lobby_id',
			'connect_lobby' : 'connect_lobby',
			'became_master' : 'became_master',
			'stop_master' : 'stop_master'
		})
		this.router = new DomainRouter();
		this.GameController = new GameController();

		this.router.registerDomain('game', this.GameController);
	}

	get_lobbies(ws, msg)
	{
		let lobbies_ = LobbyManager.lobbies;

		let lobbies = [];

		for(let item in lobbies_)
		{
			let lobby = lobbies_[item];
			lobbies.push(lobby.getInfo());
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

				console.log();
				msg.data.id = lobby.id;
				this.connect_lobby(ws, msg )
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
			let id = msg.data.id;

			let lobby = LobbyManager.getLobbyById(id)

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
					if (code === LobbyManager.LOBBY_CREATED_OK)
					{
						let is_host = lobby.host.key == key;
						let lobby_ = lobby.getFullInfo(client);

						client.send('lobby_connected', { lobby : lobby_, code });
					}
					else
					{
						client.send('lobby_connected', { code });

					}
					
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
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);

			if (lobby)
				this.send(ws,'lobby_id', lobby.id);
		}
	}

	became_master(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby)
			{
				lobby.setMaster(client);
			}
		}
	}

	stop_master(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby && lobby.master?.key === key)
			{
				lobby.removeMaster();
			}
		}
	}

	action(rout, ws, msg)
	{
		if (rout.includes('.'))
		{
			this.router.run(rout, ws, msg)
		}
		else
		{
			let method = this.routes[rout];
			this[method](ws, msg);
		}
	
	}

}

module.exports = LobbyController;