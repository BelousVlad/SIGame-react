const ClientManager = require('./ClientManager');

module.exports = class SocketSpeaker{

	constructor()
	{

	}

	answer(ws, msg)
	{
		msg = JSON.parse(msg);

		//console.log(msg);

		for(let route in SocketSpeaker.routes)
		{
			if (msg.action == route)
				this[SocketSpeaker.routes[route]]( ws, msg );
		}
	}

	ping(ws, msg)
	{
		ws.send(JSON.stringify({action: "ping", data: "pong"}));
	}

	send_key(ws, msg)
	{
		let key = msg.data;

		//console.log(msg);

		if (key != "0") // Игрок имеет ключ
		{
			//this.send(ws,{action: "ping" , data: "pong"});
			let client = ClientManager.getClient(key);
			if (client == undefined)
			{
				let key = ClientManager.createClient();
				let client = ClientManager.getClient(key);
				client.addSocket(ws);
				this.send( ws, { action: "set_key", data: key } );
			}
			else
			{
				client.addSocket(ws);
			}
			console.log(ClientManager.clients);
		}
		else
		{
			let key = ClientManager.createClient();
			let client = ClientManager.getClient(key);
			client.addSocket(ws);
			this.send( ws, { action: "set_key", data: key } );
		}
	}

	send(ws, data)
	{
		ws.send(JSON.stringify(data))
	}


	static get routes()
	{
		return {
			"ping" : "ping",
			"key" : "send_key"
		}
	}
}