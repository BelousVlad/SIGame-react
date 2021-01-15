const WebSocket = require('ws');


module.exports = class Client{
	constructor(key)
	{
		this.key = key;
		this.sockets = [];
	}

	addSocket(ws)
	{
		this.clearClosedSockets();
		this.sockets.push(ws);
	}

	send(msg)
	{
		this.clearClosedSockets();
		this.sockets.forEach( (item, index) => {
			if (item.readyState == WebSocket.OPEN)
			{
				item.send(msg)
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