const WebSocket = require('ws');
const chalk = require('chalk');

const templates = {
	'console_log' : ( msg ) => {
		console.log( msg.data );
	}
}

const server = new WebSocket.Server({ port : 3001 });

console.log(chalk.yellow('socket-Server started.'));

server.on('connection', (ws) => {

	console.log(chalk.green('client connected.'));

	ws.on('message', (msg) => {
		msg = JSON.parse(msg);
		for ( let i in templates ){
			if ( i == msg.act )
				templates[i](msg);
		}
	})

	ws.on('close', () => {
		console.log(chalk.red('client disconnected.'))
	})
})

