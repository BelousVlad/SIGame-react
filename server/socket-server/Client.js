const WebSocket = require('ws');
const event = require('events');
const config = require('../config.js');

class Client {
	constructor(key)
	{
		this.key = key;
		this.sockets = [];
		this.name = null;
		this.avatarCode = config.baseAvatarCode;
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
		this.sockets.forEach((item, index) => {
			if (item.readyState == WebSocket.CLOSED || item.readyState == WebSocket.CLOSING)
			{
				this.sockets.splice(index,1);
			}
		})
	}
	
	getDisplayParams() {
		return {
			name : this.name,
			avatar : this.avatarCode,
		}
	}
}

Object.assign( Client.prototype, event.prototype ) // 2-nd step of mix-in by event

module.exports = Client;