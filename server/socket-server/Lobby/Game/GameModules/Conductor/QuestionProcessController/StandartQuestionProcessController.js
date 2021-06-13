const AbstractQuestionProcessController = require('./AbstractQuestionProcessController');
const config = require('../../../../../../config.js');
const Timer = require(config.timerPath);
const Helper = require(config.helperClassPath);

class StandartQuestionProcessController extends AbstractQuestionProcessController {
	constructor(lobby, game)
	{
		super(lobby, game);
		this.reply_request_time = .15e5;
		this.reply_question_time = 15e3;
		this.answers_check_question_time = 15e3;
		this.betting_time = 10e3;
		this.question_time = 15e3;
		this.final_round_answer_time = 15e3;
		this.timer = null;
	}

	startQuestionProcess(question)
	{
		console.log('QUESTION', question.getQuestionResources());
        this.check_process = null;
        this.reply_process = null;
        this.ask_reply_process = null;

		return new Promise((resolve,reject) => {
			this.current_question = question;
			this.service_data = {};
			resolve();
		})
		.then(() => {
			return this.questionPreprocess(question)
		})
		.then(() => {
			return this.questionReplyPreprocess(question)
		})
		.then((reply_clients) => {
			return this.questionProcess(reply_clients)
		})
		.then(() => {
			return this.checkProcess();
		})
		.then(() => {
			for(let key in this.check_process.evaluation_clients)
			{
				const mark = this.check_process.evaluation_clients[key];

				if (mark)
					this.game.addScore(this.reply_process.players[key], this.current_question.price);
				else
					this.game.addScore(this.reply_process.players[key], -this.current_question.price);

				}
			this.lobby._updatePlayers();
		})
	}

	startFinalRoundQuestionProcess(question)
	{
        this.check_process = null;
        this.ask_reply_process = null;
        this.bet_wait_process = null;

        const players = Object.values(this.lobby.clients).filter(player => player.key !== this.lobby.master.key);
        const playersObj = Object.fromEntries(players.map(player => [player.key, player]));

		return new Promise((resolve,reject) => {
			this.current_question = question;
			this.service_data = {};
			resolve();
		})
		.then(() => {
			return this.questionBettingProcess(players);
		})
		.then(() => {
			return this.questionPreprocess(question)
		})
		.then(() => {
			// TODO REWORK
			this.reply_process = new Object;
			// this.reply_process.players = playersObj;
			// console.log('PLAYERS: ', this.reply_process.players);
		})
		.then(() => {
			return this.questionProcess(playersObj)
		})
		.then(() => {
			return this.checkProcess();
		})
		.then(() => {
			console.log('this.check_process.evaluation_clients ', this.check_process.evaluation_clients);
			console.log('this.bet_wait_process.bets_of_clients ', this.bet_wait_process.bets_of_clients);
			for(let key in this.check_process.evaluation_clients)
			{

				const mark = this.check_process.evaluation_clients[key];
				const award = this.bet_wait_process.bets_of_clients.find(bet_of_client => bet_of_client.client_key === key).bet;

				console.log(award);

				if (mark)
					this.game.addScore(this.reply_process.players[key], award);
				else
					this.game.addScore(this.reply_process.players[key], -award);
			}
		})
	}

	sendClientResources(client, resources)
	{
		client.send('question_resources', resources)
	}

	startForAllReady()
	{
		this.wait_process = {};
		this.wait_process.clients = {};
		for(let key in this.lobby.clients)
		{
			this.wait_process.clients[key] = this.lobby.clients[key];
		}
	}


	waitForAllReady(timeout_)
	{
		return new Promise((resolve, reject) => {
			this.wait_process.wait_timer = new Timer(timeout_, {
				success: resolve,
				fail: resolve
			});

			if (Object.keys(this.wait_process.clients).length === 0) {
				this.wait_process.wait_timer.forceSuccess();
			}
			this.wait_process.resolve = resolve;
		})
	}

	clientReady(client)
	{
		if (this.wait_process)
		{
			delete this.wait_process.clients[client.key];

			if (Object.keys(this.wait_process.clients).length === 0)
			{
				this.wait_process.wait_timer.forceSuccess();
			}
		}
	}
	clientsStage(stage_number, time, resource)
	{
		for(let key in this.lobby.clients)
		{
			this.lobby.clients[key].send('question_stage', { stage_number: stage_number, time: time, resource });
		}
	}

	sendResources(resources)
	{
		for(let key in this.lobby.clients)
		{
			this.sendClientResources(this.lobby.clients[key], resources)
		}
	}

	async questionPreprocess(question)
	{
		// send all resources.
		this.startForAllReady();
		const resources = question.getQuestionResources();
		this.sendResources(resources);
		await this.waitForAllReady(resources.length * 10e3); // 10 sec for each resource

		// show resources one by one up to back of array.
		let stage = 0;
		for (const resource of resources)
		{
			// this.startForAllReady();
			if (resource.value)
			{
                let time = 0;
                if (resource.time)
                    time = resource.time * 1e3;
                else
                {
                    if (resource.type === 'text')
                        time = 1.375 + resource.content.length / 25; // 25 - скорость чтения символов в минуту
                    else
                        time = 5;
                    time *= 1e3;
                }
                time = 10e3;
                this.clientsStage(stage, time, resource);

                await this.sleep(time);
            }
			stage++;
		}
	}

	skip()
	{
		this.timer.forceFail(-1);
	}

	startAskReplyProcess()
	{
		this.ask_reply_process = {};

		this.ask_reply_process.clients = {}
	}

	askToReply(client)
	{
		if (this.ask_reply_process)
		{
			this.ask_reply_process.clients[client.key] = client;
			this.lobby.sendForClients('client_ask_reply', client.getDisplayParams())
		}
	}
	questionReplyPreprocess()
	{
		return new Promise((resolve, reject) => {
            this.timer = new Timer(this.reply_request_time, {
                fail: () => {
                    reject(-2);
                },
                success:  () => {
                    resolve(this.ask_reply_process.clients);
                },
                filter: () => Object.keys(this.ask_reply_process.clients).length > 0
            });

			this.startAskReplyProcess();
			this.lobby.sendForClients('client_question_reply_request', {
				time: this.reply_request_time
			});
		})
	}

	start_reply_wait(reply_clients)
	{
		this.reply_process = {};
		this.reply_process.players = reply_clients;
		this.reply_process.answers = {};
	}


	clientReply(client, answer)
	{
		if (this.reply_process)
		{
			if (client.key in this.reply_process.players)
				this.reply_process.answers[client.key] = answer;
		}
	}

	clientMakeBet(client, bet)
	{
		console.log(10);
		if (this.bet_wait_process) {
			const keys_of_players_without_bet = this.bet_wait_process.bets_of_clients
				.filter(player => player.bet === undefined)
				.map(player => player.client_key);

			console.log(11);
			if (keys_of_players_without_bet.indexOf(client.key) !== -1) {
				const player = this.bet_wait_process.bets_of_clients.find(player => player.client_key === client.key);

				player.bet = bet;
				console.log(12);
				if (keys_of_players_without_bet === 1) {
					console.log(13);
					this.bet_wait_process.timer.forceSuccess();
				}
			}
		}
	}

	_getReplyClients()
    {
    	console.log('replproc: ', this.reply_process);
        let arr = [];
        for(let key in this.reply_process.players)
        {
            arr.push(this.reply_process.players[key].getDisplayParams())
        }
        return arr;
    }

	questionProcess(reply_clients)
	{
		return new Promise((resolve, reject) => {
            this.timer = new Timer(this.reply_request_time, {
                fail: reject,
                success: resolve,
                filter: () => true
            });

			this.start_reply_wait(reply_clients);

			const arr = this._getReplyClients();
			this.lobby.sendForClients('question_process', {
				reply_clients: arr,
				time: this.reply_question_time
			});

			for(let key in reply_clients)
			{
				reply_clients[key].send('reply_question', {
					time: this.reply_question_time
				})
			}
		})
	}

	questionBettingProcess(clientsToBet)
	{
		return new Promise((resolve, reject) => {
			this.bet_wait_process = {
				bets_of_clients: clientsToBet.map(
					player => ({
						client_key: player.key,
						bet: undefined,
					})
				),
				timer: new Timer(this.betting_time, {
					success: () => {
						this.bet_wait_process.timer = null;
						resolve();
					},
					fail: () => {
						this.bet_wait_process.timer = null;

						this.bet_wait_process.bets_of_clients.forEach(player => {
							if (!player.bet)
								player.bet = this.game.game_info.scores[player.client_key]; // if client havent maked bet, then put it all-in
						})

						resolve();
					},
					filter: () => false /* imply fail if forceSuccess havent been called */
				})
			}

			clientsToBet.forEach(player => player.send('make_bet', {
				time: this.betting_time
			}))
		});
	}

	start_check_process()
	{
		this.check_process = {};
		this.check_process.evaluation_clients = {};

		console.log('PLAYERS: ', this.reply_process.players);
		for (const key in this.reply_process.players)
		{
			// console.log('key' , key)
			this.check_process.evaluation_clients[key] = false;
		}
	}

	evaluationAnswerClient(ev_client, mark)
	{
		if (ev_client.key in this.check_process.evaluation_clients)
		{
			this.check_process.evaluation_clients[ev_client.key] = mark;
			this.lobby.sendForClients('question_answer_evaluated', {
				...ev_client.getDisplayParams(),
				mark: mark ?? false
			})
		}
	}

	checkProcess()
	{
		return new Promise((resolve, reject) => {
            this.timer = new Timer(this.reply_request_time, {
                fail: reject,
                success: resolve
            });

			this.start_check_process();

			const arr = this._getAnswersClients();
			// this.lobby.sendForClients('question_answers', {
			// 	reply_clients: arr,
			// 	time: this.answers_check_question_time
			// });

			for(let key in this.lobby.clients)
			{
				const player = this.lobby.clients[key];

				player.send('question_answers', {
					reply_clients: arr,
					time: this.answers_check_question_time,
					right: this.current_question.getRightResources(),
					is_you_check: key === this.lobby.master.key
				});
			}
		})
	}

	_getAnswersClients()
    {
        let arr = [];
        for(let key in this.reply_process.players)
        {
            arr.push({
                ...this.reply_process.players[key].getDisplayParams(),
                answer: this.reply_process.answers[key]
            })
        }
        return arr;
    }

	sleep(time)
	{
		return new Promise((resolve, reject) => {
			this.timer = new Timer(time, {
				fail: resolve,
				success: resolve
			})
		})
	}

	forceEndProcess()
	{
		if (this.timer && !this.timer.isTimerEnd)
			this.timer.forceEnd(-1);
		if (this.wait_process && this.wait_process.wait_timer && !this.wait_process.wait_timer)
		{
            this.wait_process.wait_timer.forceEnd(-1);
		}
	}

    getProcessInfo(client)
    {
        const obj = {};
        if (this.timer)
            obj.time = this.timer.getLeftTime();
        if (this.check_process)
        {
            Object.assign(obj, this._getCheckProcessInfo(client));
            obj.process = 'check_process';
        }
        else if (this.reply_process)
        {
            Object.assign(obj, this._getReplyProcessInfo(client));
            obj.process = 'reply_process';
        }
        else if (this.ask_reply_process)
        {
            obj.process = 'ask_reply_process';
        }
        else
        {
            obj.resources = this.current_question.getQuestionResources();
            obj.process = 'question_stage';
        }

        return obj;
    }
    _getCheckProcessInfo(client)
    {
        let obj = {};
        obj.reply_clients = this._getAnswersClients();
        if (client && client.key === this.lobby.master.key)
            obj.right = this.current_question.getRightResources();
        return obj;
    }
    _getReplyProcessInfo(client)
    {
        let obj = {};
        obj.reply_clients = this._getReplyClients();
        if (client)
        {
            const keys = Object.keys(this.reply_process.players);
            obj.is_reply = keys.includes(client.key);
        }
        return obj;
    }
}


module.exports = StandartQuestionProcessController;