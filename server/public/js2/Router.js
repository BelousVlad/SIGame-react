class Router{

	constructor(response_manager)
	{
		this.manager = response_manager
	}

	get routes()
	{
		return {
			'set_key': 'set_key'
		};
	}

	getServerMessage(message)
	{
		this.manager[this.routes[message.action]](message);
	}
}