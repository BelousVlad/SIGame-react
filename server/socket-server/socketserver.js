const WebSocket = require('ws');
const chalk = require('chalk');
const config = require('./../config');
const helper = require(config.helperClassPath);
const SocketSpeaker = require('./SocketSpeaker.js');
const ClientManager = require('./ClientManager');
const LobbyManager = require('./LobbyManager');




module.exports = class SocketServerW{

	constructor( app ){
		this.server = new WebSocket.Server({ port : 3001 });
		this.initServer();
		this.initTemplates();
		this.app = app;
		this.lobbies = [];
		this.speaker = new SocketSpeaker();
		console.log(chalk.yellow('socket-server started.'));
	}

	initServer(){
		this.server.on('connection', (ws) => {
			console.log(chalk.green('client connected.'));
			ws.on('message', (msg) => {

				this.speaker.answer(ws, msg);

			})
			ws.on('close', () => {
				console.log(chalk.red('client disconnected.'))
			})
		})
	}
	initTemplates(){
		this.templates = { // TODO error handler if message is't correct
			
			'create_lobby' : ( msg ) => {
				if (!msg)
					console.log( chalk.red('incorrect input in create lobby function') );
				let lobbyName = msg.data.lobbyName;
				let maxPlayers = msg.data.maxPlayers;
				let password = msg.data.password;
				let rules = msg.data.rules;
				this.lobbies.push( {
					lobbyName : lobbyName,
					maxPlayers : maxPlayers,
					password : password,
					rules : rules
				} );
			},
			'delete_lobby' : ( msg ) => {
				if (! (msg && msg.data && msg.data.name) )
					console.log( chalk.red('incorrect input in delete lobby function') );
				let name = msg.data.name;
				this.lobbies.indexOf( name ) || this.lobbies.pop( this.lobbies.indexOf( name ) );
				;
			}
		}
	}
}