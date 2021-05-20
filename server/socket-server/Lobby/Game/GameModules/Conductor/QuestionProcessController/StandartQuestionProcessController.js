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
		this.question_time = 15e3;
		this.timer = null;
	}

	startQuestionProcess(question)
	{
		return new Promise((resolve,reject) => {
			this.current_question = question;
			this.service_data = {}
			console.log(question.getRightResources());
			resolve();
		})
		.then(() => {
			console.log('questionPreprocess')
			return this.questionPreprocess(question)
		})
		.then(() => {
			console.log('questionReplyPreprocess')
			return this.questionReplyPreprocess(question)
		})
		.then((reply_clients) => {
			console.log('questionProcess')
			return this.questionProcess(reply_clients)
		})
		.then(() => {
			console.log('checkProcess')
			return this.checkProcess()
		})
		.then(() => {
			let right_keys = Object.keys(this.check_process.right_clients);
			for(key in this.reply_process.players)
			{
				if (right_keys.includes(key))
					this.game.addScore(this.current_question.price)
				else
					this.game.addScore(-this.current_question.price)
			}
		})
		.catch((err) => {
			console.log('err: ', err);
		})
	}

	sendClientResources(client, resources)
	{
		client.send('question_resources', resources)
	}

	startForAllReady()
	{
		this.wait_process = {}
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
			})

			if (Object.keys(this.wait_process.clients).length === 0) {
				console.log('waited')
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
		let resources = question.getQuestionResources();
		this.sendResources(resources)
		await this.waitForAllReady(resources.length * 10e3) // 10 sec for each resource
		// console.log('clients ready');

		// show resources one by one up to back of array.
		let stage = 0;
		for(let resource of resources)
		{
			// this.startForAllReady();
			let time = 0;
			if (resource.time)
				time = resource.time * 1e3
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

			stage++;
		}

		return null;
	}

	skip()
	{
		console.log('skip');

		this.timer.forceFail(-1);
	}

	startAskReplyProcess()
	{
		this.ask_reply_process = {};

		this.ask_reply_process.clients = {}
	}

	askToReply(client)
	{
		console.log('ask')
		if (this.ask_reply_process)
		{
			this.ask_reply_process.clients[client.key] = client;
			this.lobby.sendForClients('client_ask_reply', client.getDisplayParams())
		}
	}
	questionReplyPreprocess()
	{
		return new Promise((resolve, reject) => {
			this.startAskReplyProcess()
			this.lobby.sendForClients('client_question_reply_request', {
				time: this.reply_request_time
			});

			this.timer = new Timer(this.reply_request_time, {
				fail: () => {
					reject(-2);
					this.ask_reply_process = null;
				},
				success:  () => {
					resolve(this.ask_reply_process.clients);
					this.ask_reply_process = null;
				},
				filter: () => Object.keys(this.ask_reply_process.clients).length > 0 }
			)
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
			let keys = Object.keys(this.reply_process.players);

			if (keys.includes(client.key))
				this.reply_process.answers[client.key] = answer;
		}
	}

	questionProcess(reply_clients)
	{
		return new Promise((resolve, reject) => {
			this.start_reply_wait(reply_clients)

			let arr = []
			for(let key in reply_clients)
			{
				arr.push(this.lobby.clients[key])
			}
			this.lobby.sendForClients('question_process', {
				reply_clients: arr.map((i) => i.getDisplayParams()),
				time: this.reply_question_time
			})

			for(let key in reply_clients)
			{
				this.lobby.clients[key].send('reply_question', {
					time: this.reply_question_time
				})
			}
			this.timer = new Timer(this.reply_request_time, {
				fail: reject,
				success: resolve,
				filter: () => true
			})
		})
	}

	start_check_wait()
	{
		this.check_process = {}
		this.check_process.right_clients = {};
	}

	rightAnswerClient(right_client)
	{
		let keys = Object.keys(this.reply_process.players);

		if (keys.includes(right_client.key))
			this.check_process.right_clients[right_client.key];
	}

	checkProcess()
	{
		return new Promise((resolve, reject) => {
			let arr = []
			for(let key in this.reply_process.players)
			{
				arr.push({
					...this.lobby.clients[key].getDisplayParams(),
					answer: this.reply_process.answers[key]
				})
			}
			this.lobby.sendForClients('question_answers', {
				reply_clients: arr,
				time: this.answers_check_question_time
			})

			this.lobby.master.send('check_answer', {
				right: this.current_question.getRightResources(),
				time: this.answers_check_question_time
			})

			this.timer = new Timer(this.reply_request_time, {
				fail: reject,
				success: resolve,
				filter: () => true
			})
		})
	}

	sleep(time)
	{
		return new Promise((resolve, reject) => {
			this.timer = new Timer(time, {
				fail: resolve,
				success: resolve,
				filter: () => true
			})
		})
	}
}

module.exports = StandartQuestionProcessController;