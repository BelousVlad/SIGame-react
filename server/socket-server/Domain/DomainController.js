class DomainController {
	constructor(routes)
	{
		this.routes = routes;
	}

	action(rout, ws, msg)
	{
		let method = this.routes[rout];
		this[method](ws, msg);
	}

	send(ws, action ,data)
	{
		ws.send(JSON.stringify({action, data}))
	}
}

module.exports = DomainController;