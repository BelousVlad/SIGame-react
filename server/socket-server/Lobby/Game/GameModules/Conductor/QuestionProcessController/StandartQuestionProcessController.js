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
		this.question_time = 15e3;
	}

	startQuestionProcess(question)
	{
		return new Promise((resolve,reject) => {
			this.current_question = question;
			this.reply_clients = {};
			this.service_data = {}
			resolve();
		})
		.then(() => {
			return this.questionPreprocess(question)
		})
		.then(() => {
			return this.questionReplyPreprocess();
		})
		.then((reply_clients) => {
			this.questionProcess(reply_clients);
		}, () => { //no one reply
			throw 1;
		})
	}

	questionReply(client)
	{
		if (!this.timer.isTimerEnd)
		{
			this.reply_clients[client.key] = client;
		}
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
			setTimeout(resolve, timeout_, this.wait_process);
			if (Object.keys(this.wait_process.clients).length === 0) {
				resolve();
			}
			this.wait_process.resolve = resolve;
		})
	}

	clientReady(client)
	{
		if (this.wait_process)
		{
			delete this.wait_process.clients[client.key];

			if (Object.keys(this.wait_process.clients).length)
				this.wait_process.resolve(this.wait_process);
		}
	}

	askToReply(client)
	{
		this.reply_clients[client.key] = client;
	}

	clientsStage(stage_number, time)
	{
		for(let key in this.lobby.clients)
		{
			this.lobby.clients[key].send('question_stage', { stage_number: stage_number, time: time });
		}
	}

	async questionPreprocess(question)
	{
		// send all resources.
		this.startForAllReady();
		let resources = question.getQuestionResources();
		for(let key in this.lobby.clients)
		{
			this.sendClientResources(this.lobby.clients[key], resources)
		}
		await this.waitForAllReady(resources.length * 1e3); // 1 sec for each resource

		console.log('clients ready');

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
			this.clientsStage(stage, time);

			await Helper.sleep(time);

			stage++;
		}
	}

	questionReplyPreprocess()
	{
		return new Promise((resolve, reject) => {
			this.lobby.sendForClients('client_question_reply_request', { 
				time: this.reply_request_time
			});

			this.reply_question_timer = new Timer(this.reply_request_time, {
				fail: reject,
				success:  () => {
					resolve(this.reply_clients);
				}, filter: () => Object.keys(this.reply_clients).length > 0 }
			)
		})
	}

	questionProcess(reply_clients)
	{
		lobby.sendForClients('question_process', { 
			reply_clients: reply_clients.map((i) => i.getDisplayParams()),
			time: this.reply_question_time
		})

		for(let key in reply_clients)
		{
			this.lobby.clients[key].send('reply_question', {
				time: this.reply_question_time
			})
		}
	}
}

module.exports = StandartQuestionProcessController;