class Router{
	get routes()
	{
		return {
			"ping" : "ping",
			"set_key" : "setKey",
			"update_name" : "updateName",
			"lobby_created" : "lobby_created",
			"lobby_connected" : "lobby_connected",
		};
	}

	getServerMessage(message)
	{
		let ans = JSON.parse(message);
		app[this.routes[ans.action]](ans);
	}
}