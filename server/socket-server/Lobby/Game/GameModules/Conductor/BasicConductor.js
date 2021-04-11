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
		this.status = 0;

		this.game.registerModuleMessage('test_module_msg', this, this.test_module_msg);

	}

	test_module_msg(ws, msg)
	{
		console.log(msg);
	}

	//override
	turn()
	{
		if (this.test == 0)
		{
			let client;
			for(let cl in this.lobby.clients) //Просто побыстрому получаем любого клиента
			{
				client = this.lobby.clients[cl];
				break;
			}

			let time = 15000;

			this.status = 'wait';

			this.timer = new Timer(time, { fail: (e) => {

					this.status = 0;
					let question = { text: 'fail - random question' };
					this.startQuestionProcess(question);

				}, success:  (e) => {

					this.status = 0;
					let question = { text: 'success - normal question' };
					this.startQuestionProcess(question);

				}, filter: (e) => this.status !== 'wait'}
			)
			console.log(this.timer);

			client.send('choose_question', { time } );
		}
	}

	questionChoosed(client, question)
	{
		//console.log(this)
		//console.log(this.timer)

		if (this.status == 'wait') 
		{
			this.timer.forceSuccess();
		}
		else
			this.timer.forceFail();
	}

	startQuestionProcess(question)
	{
		this.QestionProcessController.startQuestion(question);
	}

}

module.exports = BasicConductor;

