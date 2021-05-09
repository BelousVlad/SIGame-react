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
		this.last_choiced_player_key = undefined; /*Object.keys(this.lobby.clients)[0];*/
		this.game.registerModuleMessage('test_module_msg', this, this.test_module_msg); //TODO delete

		this.choose_question_time = 10e3;
	}

	test_module_msg(ws, msg)
	{
		console.log('test message: ', msg);
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
			//this.status = 'question-process' //TODO check next round
			this.turn();
		})
		.catch((val) => {
			console.log('question process catch:', val);
			if (val === 1)
				console.log('No one reply')
		});
	}

	chooseQuestion()
	{
		let player = this.getQueueQuestionPlayer();
		this.choose_player = player;
		this.requireChooceQuestion(player);
	}

	clientReady(client)
	{
		this.QestionProcessController.clientReady(client);
	}

	askToReply(client)
	{
		this.QestionProcessController.askToReply(client);
	}

	requireChooceQuestion(player)
	{
		let time = this.choose_question_time;
		this.lobby.sendForClients('choosing_question', { player_name: player.name, time: time } );
		player.send('choose_question', { time: time });
		this.status = 'wait-choose-question';

		this.timer = new Timer(time, {
			fail: (e) => {
				console.log('fail branch');
				this.status = 'processing-question';
				//let question = { text: 'fail - normal question' }; //TODO GET random question
				let question = this.game.getRandomQuestion();

				this.startQuestionProcess(question);

			}, success:  (client, question) => {
				this.status = 'processing-question';
				console.log('suc branch');
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

		// if specific player with right for choose is avaiable then return it.
		if ( Object.keys(this.lobby.clients).indexOf(this.player_with_right_for_choose) !== -1 && this.lobby.master !== this.player_with_right_for_choose)
			return this.player_with_right_for_choose;

		var playersList = Object.values(this.lobby.clients).filter(player => player.key !== this.lobby.master.key);

		this.player_with_right_for_choose = playersList[ /*get random index*/ parseInt( Math.random() * playersList.length ) ];

		return this.player_with_right_for_choose;
	}
}

module.exports = BasicConductor;

