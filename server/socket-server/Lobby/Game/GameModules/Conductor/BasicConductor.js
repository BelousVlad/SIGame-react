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
		this.pregame_info_time = 5e3;
		this.round_title_time = 5e3;
		this.choose_question_time = 10e3;
	}

	//overrided
	turn()
	{
		if (this.status === 'choice_question') {
			this.sendRound();
			this.chooseQuestion();
		}
		else if (this.status === 'after_question')
		{
			let round = this.game.getRoundInfo();
			let res = round.prices.find(i => i.length !== 0)
			if (!res)
				this.nextRound().then(() => {
					this.status = 'choice_question';
					this.turn();
				});
			else
			{
				this.status = 'choice_question';
				this.turn();
			}

		}
		else if (this.status === 'first_turn')
		{
			this.game.game_info.current_round = 0;
			this.showPregameInfo()
			.then(() => {
				let round = this.game.getRoundInfo();
				return this.showRoundTitle(round)
			})
			.then((round) => {
				this.status = 'choice_question'
				this.turn();
			})
		}
	}

	nextRound()
	{

		this.game.game_info.current_round++;
		let round = this.game.getRoundInfo();
		return this.showRoundTitle(round);
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
		.catch((val) => {
			console.log('question process catch:', val);
			if (val === -1)
				console.log('Sjip stage')
			else if (val === -2)
				console.log('No one reply')
		})
		.then(() => {
			//this.status = 'question-process' //TODO check next round
			// this.lobby._updatePlayers();
			console.log('ended question process');
			this.status = 'after_question'
			this.game.setQuestionUsed(question)
			this.turn();
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
		// this.lobby.sendForClients();

		for(let p in this.lobby.clients)
		{
			this.lobby.clients[p].send('choosing_question', {player_name: player.name, time: time, is_you: player.key === p });
		}
		// player.send('choose_question', { time: time });
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

		let keys = Object.keys(this.lobby.clients); //TODO DELETE
		return this.lobby.clients[keys[0]];

		// if specific player with right for choose is avaiable then return it.
		if ( Object.keys(this.lobby.clients).indexOf(this.player_with_right_for_choose) !== -1 && this.lobby.master !== this.player_with_right_for_choose)
			return this.player_with_right_for_choose;

		var playersList = Object.values(this.lobby.clients).filter(player => player.key !== this.lobby.master.key);

		this.player_with_right_for_choose = playersList[ /*get random index*/ parseInt( Math.random() * playersList.length ) ];

		return this.player_with_right_for_choose;
	}

	showPregameInfo()
	{
		this.lobby.sendForClients('pregame_info', { 
			info: this.game.getPackInfo(),
			time: this.pregame_info_time
		});

		return new Promise((resolve,reject) => {
			this.timer = new Timer(this.pregame_info_time, {
				fail: resolve,
				success: resolve,
				filter: () => true
			})
		})
	}

	showRoundTitle(round)
	{
		this.lobby.sendForClients('show_round_title', { 
			title: round.roundName,
			time: this.pregame_info_time
		});

		return new Promise((resolve, reject) => {
			this.timer = new Timer(this.round_title_time, {
				fail: () => { resolve(round) },
				success: () => { resolve(round) },
				filter: () => true
			})
		})
	}

	skip_stage()
	{
		console.log('skip stage')
		this.QestionProcessController.skip();
	}

	clientReply(client, answer)
	{
		this.QestionProcessController.clientReply(client, answer);
	}

	evaluationAnswerClient(client, mark)
	{
		this.QestionProcessController.evaluationAnswerClient(client, mark);
	}
}

module.exports = BasicConductor;

