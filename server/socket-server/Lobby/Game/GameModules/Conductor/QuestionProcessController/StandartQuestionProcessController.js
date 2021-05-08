const AbstractQuestionProcessController = require('./AbstractQuestionProcessController');
const config = require('../../../../../../config.js');
const Timer = require(config.timerPath);

class StandartQuestionProcessController extends AbstractQuestionProcessController {
	constructor(lobby, game)
	{
		super(lobby, game);
		this.reply_request_time = .15e5;
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
			console.log('log')
			return this.questionProcess(question)
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
		console.log('send resouces');
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
			setTimeout(() => resolve(), timeout_);
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
				this.wait_process.resolve();
		}
	}

	clientsStage(stage_number)
	{
		for(let key in this.lobby.clients)
		{
			lobby.clients[key].send('question_stage', { stage_number: stage_number });
		}
	}

	async questionProcess(question)
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
			this.startForAllReady();

			this.clientsStage(stage);

			let time = 0;
			if (resource.time)
				time = resource.time * 1e3
			else
			{
				if (resource.type === 'text')
					time = 1.375 + resource.content.length / 25; // 25 - скорость чтения символов в минуту

				time *= 1e3;
			}

			await this.waitForAllReady(time + 1e3); // gives 1 additional second
			stage++;
		}

		// answer stage start
		lobby.sendForClients('client_question_reply_request', { time: this.reply_request_time });

	}

}

module.exports = StandartQuestionProcessController;
