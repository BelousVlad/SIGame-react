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

	startQuestion(question)
	{
		return new Promise((resove,reject) => {
			this.current_question = question;
			this.reply_clients = {};
			this.service_data = {}
			lobby.sendForClients('client_question_reply_request', { price: question.price, time: this.reply_request_time });

			this.timer = new Timer(this.reply_request_time, {
				fail: (e) => {
					reject();
				}, success:  (client, question) => {

					//resolve(this.questionProcess(question)); TODO CHECK
					this.questionProcess(question)
						.then((res) => { resolve(res); });

				}, filter: (e) => Object.keys(this.reply_clients).length > 0 }
			)
		})
	}

	questionReply(client)
	{
		if (!this.timer.isTimerEnd)
		{
			this.reply_clients[client.key] = client;
		}
	}

	questionProcess(question)
	{
		return Promise((resolve, reject) => { 
			for(let key in this.reply_clients)
			{
				// this.reply_clients[key].send('question', question: {

				// });
				//TODO resouces

			}

			this.timer = new Timer(this.question_time, {
				fail: (e) => {
					reject();
				}, success:  (client, question) => {

					//resolve(this.questionProcess(question)); TODO CHECK
					this.questionProcess(question)
						.then((res) => { resolve(res); });

				}, filter: (e) => Object.keys(this.reply_clients).length > 0 }
			)
		})
	}

}

module.exports = StandartQuestionProcessController;
