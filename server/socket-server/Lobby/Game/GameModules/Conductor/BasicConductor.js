const AbstractConductor = require('./AbstractConductor');
const StandartQestionProcessController = require('./QestionProcessController/StandartQestionProcessController');
const config = require('../../../../../config.js');
const Timer = require(config.timerPath);

class BasicConductor extends AbstractConductor {
	constructor(lobby, game)
	{
		super(lobby, game);
		this.test = 0;
		this.QestionProcessController = new StandartQestionProcessController();
		this.game.addEventListener('question-choosed')
		this.timer = {};
	}

	//override
	turn()
	{
		if (this.test == 0)
		{
			let client;
			for(let cl in this.lobby.clients) //Просто побыстрому получаем любого клиента
			{
				client = cl;
				break;
			}
			let time = 3000;



			this.game.client.send('choose_question', { time } ); 
		}
	}

	questionChoosed(client, question)
	{
		this.QestionProcessController.startQuestion(question);
	}

}


