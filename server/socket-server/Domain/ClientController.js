const DomainController = require('./DomainController');
const ClientManager = require('./../ClientManager');
const LobbyManager = require('./../Lobby/LobbyManager');

class ClientController extends DomainController{
	constructor()
	{
		super({
			'key' : 'send_key',
			'name' : 'set_name'
		})
	}

	send_key(ws, msg)
	{
		let key = msg.data;

		//console.log(msg);

		if (key != "0") // Игрок имеет ключ
		{
			let client = ClientManager.getClient(key);
			if (client === undefined)
			{
				let key = ClientManager.createClient();
				let client = ClientManager.getClient(key);
				client.addSocket(ws);
				this.send( ws, "set_key", key );
			}
			else
			{
				client.addSocket(ws);

				let status = this.getClientStatus(client);
				this.send(ws, 'status' , status);
			}
		}
		else
		{
			let key = ClientManager.createClient();
			let client = ClientManager.getClient(key);
			client.addSocket(ws);
			this.send( ws, "set_key", key);
		}
	}

	set_name(ws, msg)
	{
		let name = msg.data;
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let isNameFree = ! ClientManager.clients.find( item => item.name === name ) // в случае если имя занято на стороне клиента вызовется метод соотвуствующий руту name_set_failed
			if ( isNameFree ) {
				client.name = name;
				client.send('name_set_status', { status: 200, name} );
			} else {
				let reason = `name ${ name } alredy taken.`;
				client.send('name_set_status', { status: 400, reason });
			}
		}
	}

	status(ws, msg)
	{
		let key = msg.key;

		let client = ClientManager.getClient(key)

		if (client)
		{
			let status = this.getClientStatus(client);
			client.send('status', status);
		}
		else
		{
			ws.send('status', { errors : [{ code : 404, message : `cant find such user` }]} );
		}
	}


	//private
	getClientStatus(client)
	{
		let lobby_ = LobbyManager.getLobbyByClient(client);
		let lobby;

		console.log(lobby_, client);

		if (lobby_)
		{
			lobby = lobby_.getFullInfo(client);
		}

		return {
			lobby,
			client: client.getDisplayParams()
		}
	}

}

module.exports = ClientController;