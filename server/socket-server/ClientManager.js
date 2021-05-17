const Client = require('./Client');


class ClientManager{

	constructor()
	{
		this.clients = [];
	}

	createClient()
	{
		let key = this.generateKey();

		let client = new Client(key);

		this.clients.push(client);

		return key;
	}

	getClient(key)
	{
		return this.clients.find((client) => client.key == key);
	}

	getClientByName(name)
	{
		return this.clients.find((client) => client.name === name);
	}

	generateKey()
	{
		return '_' + Math.random().toString(36).substr(2, 9); // TODO check if this key already exist and regenerate.
	}
}

const manager = new ClientManager();

module.exports = manager;