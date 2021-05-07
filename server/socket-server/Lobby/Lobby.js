const WebSocket = require('ws');
const event = require('events');
const ClientManager = require('../ClientManager');
const Game = require('./Game/Game');
const GameInitializer = require('./Game/GameInitializer');
const Chat = require('./Chat/Chat');
const fs = require('fs');
const config = require('../../config.js')
const PackReader = require(config.packReaderPath);


class Lobby {

	packFolder = new Object();
	packState = 'none'; // состояния в котором может находиться пак. предполагается 3 варианта : none, uploading, ready;
	pack = {};

	constructor(id, title, max_p, password)
	{
		this.id = id;
		this.clients = new Object();
		this.max_players = max_p ;
		this.title = title ;
		this.password = password ;
		this.scores = {}
		this.host = undefined;
		this.master = undefined;

		this.config = Lobby.defaultConfig;
		this.game = undefined;

		this.chat = new Chat(this);
	}

	get configuration()
	{
		return this.config;
	}

	set configuration(val)
	{
		/*TODO validation*/
		let conf = {...this.defaultConfig, ...newValue};
		this[conf_sym] = conf;
	}

	getClientByName(clientName)
	{
		for(let item in this.clients)
		{
			if (this.clients[item].name == clientName)
			{
				return this.clients[item];
			}
		}
		return undefined;
	}

	changeClientScore(client, score)
	{
		if (this.clients[client.key])
		{
			this.scores[client.key] = score;

			this.emit('lobby_client_score_changed', client, score)

			return true;
		}
		return false;
	}

	sendForClients(action, data)
	{
		for(let item in this.clients)
		{
			this.clients[item].send(action, data) //TODO
		}
	}

	getClient(client)
	{
		for(let item in this.clients)
		{
			if (item == client)
			{
				return this.clients[item];
			}
		}
		return undefined;
	}

	setMaster(client)
	{
		if (!this.master && this.hasClient(client))
		{
			this.master = client;
			this.emit('lobby_master_set', client)
			return true;
		}
		return false;
	}

	removeMaster()
	{

		if (this.master)
		{
			this.master = null;
			this.emit('lobby_master_set', null)
			return true;
		}
		return false;
	}

	hasClient(client)
	{
		return !!this.getClient(client.key);
	}

	addClient(client)
	{
		let clientKey = client.key;

		if ( Object.keys( this.clients ).length < this.max_players)
		{
			this.clients[clientKey] = client;
			if (!this.scores[clientKey])
			{
				this.scores[clientKey] = 0;
			}

			if (!this.host)
			{
				this.host = client;
			}

			this.emit("player_connected", client);
			return Lobby.CLIENT_CONNECT_TO_LOBBY_OK;
		}
		else
		{
			return Lobby.MAX_PLAYERS_ERROR;
		}
	}

	kickClientByName(name)
	{
		for(let item in this.clients)
		{
			if (this.clients[item].name == name)
			{
				this.deleteClient(item);

				let client = ClientManager.getClient(item);

				client.emit('lobby_client_kicked', this);
				this.emit('lobby_client_kicked', client);

				return true;
			}
		}
		return false;
	}

	removeClient( client )
	{
		let clientKey = client.key;

		this.deleteClient(clientKey);
		client.emit('lobby_client_leave');
		this.emit('lobby_client_leave');

	}

	deleteClient(clientKey)
	{
		let client = this.clients[clientKey];
		delete this.clients[clientKey];
		if (clientKey == this.host.key)
		{
			let keyNewHost = Object.keys(this.clients)[0]
			this.host = this.clients[keyNewHost];
		}
		if (this.master && clientKey == this.master.key)
		{
			this.master = undefined;
		}
		this.emit('lobby_client_removed', client)
	}

	startGame()
	{
		console.log(this.pack);
		if (this.packState === 'ready')
		{
			console.log('pack ready')

			let factory = GameInitializer.createInstance();

			this.game = factory.createGame(this.config, this);

			this.game.start();

			this.emit('lobby_game_start');
		}
	}

	test_file(args)//test function
	{
		this.game.file_sended(args);
	}

	uploadPackStart()
	{
		this.emit('lobby_upload_pack_start');
		this.packState = 'uploading';
		if ( typeof this.packFolder === 'string') {
			fs.rmdirSync( this.packFolder, { recursive: true } );
		}
	}

	uploadPackEnd()
	{

		PackReader.getPackFromFolder(this.packFolder)
		.then((pack) => {
			this.pack = pack;
			this.packState = 'ready';
		})

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
	static get INCORRECT_PASSWORD()
	{
		return 404;
	}

	static get defaultConfig(){
		return {
			maxPlayers : 3,
			rules : {},
			password : '',
		}
	}

}

Object.assign( Lobby.prototype, event.prototype ) // 2-nd step of mix-in of event

module.exports = Lobby;