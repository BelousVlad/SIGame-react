const DomainController = require('./DomainController');

class GameController extends DomainController {
	constructor()
	{
		super({
			'choice_question' : 'choice_question'
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
}

module.exports = GameController;