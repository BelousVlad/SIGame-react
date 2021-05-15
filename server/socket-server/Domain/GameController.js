const DomainController = require('./DomainController');
const LobbyManager = require('./../Lobby/LobbyManager');
const ClientManager = require('./../ClientManager');

class GameController extends DomainController {
	constructor()
	{
		super({
			'choice_question' : 'choice_question',
			'client_ready' : 'client_ready',
			'ask_to_reply' : 'client_ask_to_reply',
			'skip_stage' : 'skip_stage'
		})
	}

	choice_question(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby)
			{
				lobby?.game.questionChoosed(
					client,
					{
						theme_index: msg.data.theme_index,
						question_index: msg.data.question_index
					}
				);
			}
		}
	}

	client_ready(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby)
			{
				lobby?.game.clientReady(client)
			}
		}
		console.log('client ready invoked, msg: ', msg);
	}

	client_ask_to_reply(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby)
			{
				lobby?.game.askToReply(client)
			}
		}
	}

	skip_stage(ws,msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby && lobby.game)
			{
				if ((lobby.master && lobby.master.key == key) || lobby.host.key == key)
					lobby.game.skip_stage(client)
			}
		}
	}
}

module.exports = GameController;