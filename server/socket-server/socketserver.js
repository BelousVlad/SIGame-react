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
}