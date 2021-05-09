class DomainController {
	constructor(routes)
	{
		this.routes = routes;
	}

	action(rout, ws, msg)
	{
		let method = this.routes[rout];

		try {
			this[method](ws, msg);
		}
		catch (e) {
			console.error(`hasnt such method ${method} or method invokation failed. message value: `, msg, '---error: ', e);
		}
	}

	send(ws, action ,data)
	{
		ws.send(JSON.stringify({action, data}))
	}
}

module.exports = DomainController;