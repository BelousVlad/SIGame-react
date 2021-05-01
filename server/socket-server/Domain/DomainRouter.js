class DomainRouter{
	constructor()
	{
		this.splitter = '.';
		this.domains = {};
	}

	registerDomain(domain, controller)
	{
		this.domains[domain] = controller;
	}

	run(rout, ws, msg)
	{
		let index = rout.indexOf(this.splitter);
		let domain = rout.substring(0, index);
		let action = rout.substring(index + this.splitter.length);

		this.domains[domain].action(action, ws, msg);
	}
}

module.exports = DomainRouter;