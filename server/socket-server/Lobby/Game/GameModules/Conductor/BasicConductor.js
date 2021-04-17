const AbstractConductor = require('./AbstractConductor');
const StandartQestionProcessController = require('./QuestionProcessController/StandartQuestionProcessController');
const config = require('../../../../../config.js');
const Timer = require(config.timerPath);

class BasicConductor extends AbstractConductor {
	constructor(lobby, game)
	{
		super(lobby, game);
		this.test = 0;
		this.QestionProcessController = new StandartQestionProcessController();
		this.game.addListener('question-choosed',this.questionChoosed.bind(this))
		this.timer = {};
		this.status = 'choice_question';
		this.last_choiced_player_key = Object.keys(this.lobby.clients)[0];
		this.game.registerModuleMessage('test_module_msg', this, this.test_module_msg);

		this.choose_question_time = 3000;
	}

	test_module_msg(ws, msg)
	{
		console.log(msg);
	}

	//override
	turn()
	{
		if (this.status == 'choice_question') {
			this.chooseQuestion();
		}
	}

	questionChoosed(client, question)
	{
		if (this.status == 'wait_for_choose_question') 
		{
			this.timer.forceSuccess(client, question);
		}
	}

	startQuestionProcess(question)
	{
		this.QestionProcessController.startQuestion(question);
	}

	chooseQuestion()
	{
		let player = this.getQueueQuestionPlayer();

		this.requireChooceQuestion(player);

	}

	requireChooceQuestion(player)
	{

		let time = this.choose_question_time;
		player.send('choose_question', { time: time });
		this.status = 'wait_for_choose_question';

		this.timer = new Timer(time, { 
			fail: (e) => {
				this.status = 0;
				//let question = { text: 'fail - normal question' }; //TODO GET random question
				let question = game.getRandomQuestion();
				this.startQuestionProcess(question);

			}, success:  (e) => {

				this.status = 0;

				let question = { text: 'success - normal question' };
				this.startQuestionProcess(question);

			}, filter: (e) => this.status !== 'wait'}
		)

	}

	getQueueQuestionPlayer() // метод для получения игрока которого очередь отвечать
	{
		let keys = Object.keys(this.lobby.clients);
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

