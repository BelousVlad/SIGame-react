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
        this.end_game_title_time = 15e3;
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

			let res = round.prices.find(theme => (theme.find(questionPrice => questionPrice !== null) !== undefined));
			if (!res)
			{
                if (this.game.isLastRound())
                {
                	console.log('END GAME');
                    this.endGame();
                }
                else
				{
                    console.log('NEXT ROUND');
                    this.nextRound();
				}
            }
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
				this.status = 'choice_question';
				this.turn();
			})
		}
	}

	nextRound()
	{

		this.game.game_info.current_round++;
		let round = this.game.getRoundInfo();
		if(this.timer)
			this.timer.die();
		this.QestionProcessController.forceEndProcess();
		return this.showRoundTitle(round).then(() => {
            this.status = 'choice_question';
            this.turn();
        });
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
				this.timer.forceSuccess(client, question);
			}
		}
	}

	startQuestionProcess(question)
	{
		this.status = 'question-process';
		this.QestionProcessController.startQuestionProcess(question)
		.catch((val) => {
			console.log('question process catch:', val);
			if (val === -1)
				console.log('Sjip stage');
			else if (val === -2)
				console.log('No one reply')
		})
		.then(() => {
			//this.status = 'question-process' //TODO check next round
			// this.lobby._updatePlayers();
			this.status = 'after_question';
			this.game.setQuestionUsed(question);
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
			fail: (arg) => {
				this.status = 'processing-question';
				//let question = { text: 'fail - normal question' }; //TODO GET random question
				let question = this.game.getRandomQuestion();

				this.startQuestionProcess(question);
				
			}, success:  (client, question) => {
				console.log('success');
				this.status = 'processing-question';

				let theme_index = question.theme_index;
				let question_index = question.question_index;
				let question1 = this.game.getQuestion(theme_index, question_index);
				// if (!question1)
					// return;
				console.log(question1, theme_index, question_index);
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

		let playersList = Object.values(this.lobby.clients).filter(player => player.key !== this.lobby.master.key);

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
		if(this.status === 'question-process')
			this.QestionProcessController.skip();
		else
			this.timer.forceFail();
	}

	clientReply(client, answer)
	{
		this.QestionProcessController.clientReply(client, answer);
	}

	evaluationAnswerClient(client, mark)
	{
		this.QestionProcessController.evaluationAnswerClient(client, mark);
	}
	endGame()
	{
		let win_players = [];
		const scores = this.game.game_info.scores;
		let max = scores[Object.keys(this.lobby.clients)[0]];

		for(let key in this.lobby.clients)
		{
			if (scores[key] > max)
			{
				win_players = [];
				win_players.push(this.lobby.clients[key]);
			}
			else if (scores[key] === max)
			{
                win_players.push(this.lobby.clients[key]);
            }
		}

		this._showEndGameTitle(win_players)
			.then(() => {
				this.lobby.endGame();
			});
	}

    getProcessInfo(client)
    {
        //TODO no question-process
        if (this.status === 'question-process')
        {
            return this.QestionProcessController.getProcessInfo(client);
        }
    }

	_showEndGameTitle(win_players)
	{
		const _win_players = win_players.map((player) => player.getDisplayParams());

		this.lobby.sendForClients('show_end_game_title', {
			players: _win_players,
			time: this.end_game_title_time
		});

        return new Promise((resolve, reject) => {
            this.timer = new Timer(this.end_game_title_time, {
                fail: resolve,
                success: resolve
            })
        })
	}
}

module.exports = BasicConductor;
