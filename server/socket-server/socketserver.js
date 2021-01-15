const WebSocket = require('ws');
const chalk = require('chalk');
const config = require('./../config');
const helper = require(config.helperClassPath);
const SocketSpeaker = require('./SocketSpeaker.js');
const ClientManager = require('./ClientManager');




module.exports = class SocketServerW{

	constructor( app ){
		this.server = new WebSocket.Server({ port : 3001 });
		this.initServer();
		this.initTemplates();
		this.app = app;
		this.lobbies = [];
		this.clientNames = [];
		this.speaker = new SocketSpeaker();
		console.log(chalk.yellow('socket-server started.'));
	}

	initServer(){
		this.server.on('connection', (ws) => {
			console.log(chalk.green('client connected.'));
			ws.on('message', (msg) => {
				/*
				msg = JSON.parse(msg);
				for ( let i in this.templates ){
					if ( i == msg.act )
						this.templates[i](msg, ws, server);
				}
				*/

				//console.log(msg);

				this.speaker.answer(ws, msg);

			})
			ws.on('close', () => {
				console.log(chalk.red('client disconnected.'))
			})
		})
	}
	initTemplates(){
		this.templates = { // TODO error handler if message is't correct
			'console_log' : ( msg, ws ) => {
				console.log( msg.data );
			},
			'check_client_name' : ( msg, ws ) => {
				let clientName = msg.data.clientName;
				if (helper.isClientNameValid( clientName )){
					this.server.clientNames.push(clientName);
					let ans = {
						act : 'name_is_valid',
						data : {
							//
						}
					};
					ws.send( JSON.stringify(ans) );
				} else {
					let ans = {
						act : 'name_is_not_valid',
						data : {
							//
						}
					};
					ws.send ( JSON.stringify(ans) );
				}
			},
			'get_file' : ( msg ) => {
				//
			},
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

	isClientNameFree ( name ){
			return ( this.clientNames.indexOf(name) == -1 );
	}
}