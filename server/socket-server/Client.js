const WebSocket = require('ws');
const event = require('events');

class Client extends event {
	constructor(key)
	{
		this.key = key;
		this.sockets = [];
		this.name = null;
	}

	addSocket(ws)
	{
		this.clearClosedSockets();
		this.sockets.push(ws);
	}

	send(action, data)
	{
		this.clearClosedSockets();
		this.sockets.forEach( (item, index) => {
			if (item.readyState == WebSocket.OPEN)
			{
				item.send(JSON.stringify({action: action, data: data}) )
			}
		})
	}
	clearClosedSockets()
	{
		this.sockets.forEach( (item, index) => {
			if (item.readyState == WebSocket.CLOSED || item.readyState == WebSocket.CLOSING)
			{
				this.sockets.splice(index,1);
			}
		})
	}
}

module.exports = Client;