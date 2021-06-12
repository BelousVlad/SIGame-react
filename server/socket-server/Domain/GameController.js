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
			'skip_stage' : 'skip_stage',
			'question_answer' : 'question_answer',
			'question_evaluation': 'question_evaluation',
			'make_bet' : 'make_bet',
			'next_round': 'next_round'
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
	question_answer(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby && lobby.game)
			{
				lobby.game.client_reply(client, msg.data.answer);
			}
		}
	}
	question_evaluation(ws, msg)
	{
		let key = msg.key;
		let client = ClientManager.getClient(key);
		if (client)
		{
			let lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby && lobby.game)
			{
				let ans_client = ClientManager.getClientByName(msg.data.name);
				if (ans_client)
					lobby.game.evaluation_answer_client(client, ans_client, msg.data.mark);
			}
		}
	}

	make_bet(ws, msg)
	{
		const key = msg.key;
		const client = ClientManager.getClient(key);
		if (client)
		{
			const lobby = LobbyManager.getLobbyByClientKey(key);
			if (lobby && lobby.game)
			{
				const bet_value = msg.data.bet_value;
				if (bet_value >= 0 && (parseInt(bet_value) === bet_value/*check if numbet is intager*/))
				{
					lobby.game.client_make_bet(client, bet_value);
				}

			}
		}
	}

    next_round(ws, msg)
	{
        let key = msg.key;
        let client = ClientManager.getClient(key);
        if (client)
        {
            let lobby = LobbyManager.getLobbyByClientKey(key);
            if (lobby && lobby.game)
            {
                if (client.key === lobby.host.key || client.key === lobby.master.key)
                    lobby.game.nextRound();
            }
        }
	}
}

module.exports = GameController;