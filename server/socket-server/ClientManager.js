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
		return this.clients.filter((client) => client.key == key)[0]
	}

	generateKey()
	{
		return '_' + Math.random().toString(36).substr(2, 9);
	}
}

const manager = new ClientManager();

module.exports = manager;