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

	set_name(ws, msg)
	{
		let name = msg.data;
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			client.name = name;
			client.send('update_name', name);
		}
	}
	send_key(ws, msg)
	{
		let key = msg.data;

		//console.log(msg);

		if (key != "0") // Игрок имеет ключ
		{
			let client = ClientManager.getClient(key);
			if (client == undefined)
			{
				let key = ClientManager.createClient();
				let client = ClientManager.getClient(key);
				client.addSocket(ws);
				this.send( ws, "set_key", key );
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
			this.send( ws, "set_key", key);
		}
	}

	send(ws, action ,data)
	{
		ws.send(JSON.stringify({action, data}))
	}


	static get routes()
	{
		return {
			"ping" : "ping",
			"key" : "send_key",
			"set_name" : "set_name",
		}
	}
}