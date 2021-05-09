const DomainController = require('./DomainController');
const LobbyManager = require('./../Lobby/LobbyManager');
const ClientManager = require('./../ClientManager');

class GameController extends DomainController {
	constructor()
	{
		super({
			'choice_question' : 'choice_question',
			'client_ready' : 'client_ready'
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
		//TODO
		console.log('client ready invoked, msg: ', msg);
	}
}

module.exports = GameController;