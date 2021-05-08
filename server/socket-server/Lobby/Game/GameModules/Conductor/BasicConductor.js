const AbstractConductor = require('./AbstractConductor');
const StandartQestionProcessController = require('./QuestionProcessController/StandartQuestionProcessController');
const config = require('../../../../../config.js');
const Timer = require(config.timerPath);

class BasicConductor extends AbstractConductor {
	constructor(lobby, game)
	{
		super(lobby, game);
		this.QestionProcessController = new StandartQestionProcessController(lobby, game);
		this.game.addListener('question-choosed',this.questionChoosed.bind(this))
		this.timer = {};
		this.status = 'first_turn';
		this.last_choiced_player_key = Object.keys(this.lobby.clients)[0];
		this.game.registerModuleMessage('test_module_msg', this, this.test_module_msg); //TODO delete

		this.choose_question_time = 3000;
	}

	test_module_msg(ws, msg)
	{
		console.log(msg);
	}

	//overrided
	turn()
	{
		if (this.status == 'choice_question') {
			console.log('pre choice_question')
			this.chooseQuestion();
		}
		else if (this.status == 'first_turn')
		{
			this.game.sendRoundInfoClients();
			this.status = 'choice_question'
			this.turn();
		}
	}

	nextRound()
	{
		this.game.game_data.current_round++;
		this.sendRound();
	}

	sendRound()
	{
		this.game.sendRoundInfoClients();
	}

	questionChoosed(client, question)
	{
		if (this.status == 'wait-choose-question')
		{
			if (client.key === this.choose_player.key || client.key === lobby.master.key)
			{
				console.log('question choised')
				this.timer.forceSuccess(client, question);
			}
		}
	}

	startQuestionProcess(question)
	{
		this.status = 'question-process'
		this.QestionProcessController.startQuestionProcess(question)
			.then(() => {
				this.status = 'question-process' //TODO check next round
				this.turn();
		});
	}

	chooseQuestion()
	{
		let player = this.getQueueQuestionPlayer();
		this.choose_player = player;
		this.requireChooceQuestion(player);
	}

	requireChooceQuestion(player)
	{
		let time = this.choose_question_time;
		this.lobby.sendForClients('choosing_question', { player_name: player.name, time: time } );
		player.send('choose_question', { time: time });
		this.status = 'wait-choose-question';

		this.timer = new Timer(time, {
			fail: (e) => {
				this.status = 'processing-question';
				//let question = { text: 'fail - normal question' }; //TODO GET random question
				let question = this.game.getRandomQuestion();

				this.startQuestionProcess(question);

			}, success:  (client, question) => {
				this.status = 'processing-question';

				let theme_index = question.theme_index;
				let question_index = question.question_index;
				let question1 = this.game.getQuestion(theme_index, question_index);
				this.startQuestionProcess(question1);

			}, filter: (e) => this.status !== 'wait-choose-question'}
		)
	}

	getQueueQuestionPlayer() // метод для получения игрока которого очередь отвечать
	{
		let keys = Object.keys(this.lobby.clients);
		return this.lobby.clients[keys[0]];

		let last_key_index = keys.indexOf(this.last_choiced_player_key);

		let index = last_key_index++;
		let player = this.lobby.clients[keys[index]];

		let master_key = this.lobby.master.key;

		if (player) {
			if (player.key == master_key) {
				this.last_choiced_player_key = master_key;
				return this.getQueueQuestionPlayer();
			}
			this.last_choiced_player_key = player.key;
			return player;
		}
		else {
			if (this.lobby.clients[keys[0]].key == master_key)
			{
				player = this.lobby.clients[keys[1]];
				this.last_choiced_player_key = player.key;
				return this.lobby.clients[keys[1]];
			}
			player = this.lobby.clients[keys[0]];
			this.last_choiced_player_key = player.key;
			return this.lobby.clients[keys[0]];
		}
	}
}

module.exports = BasicConductor;

