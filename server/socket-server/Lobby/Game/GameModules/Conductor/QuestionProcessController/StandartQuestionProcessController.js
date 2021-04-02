const AbstractQestionProcessController = require('./AbstractQestionProcessController');
const config = require('../../../../../../config.js');
const Timer = require(config.timerPath);

class StandartQuestionProcessController extends AbstractQestionProcessController {
	constructor(lobby, game)
	{
		super(lobby, game);
	}

	startQuestion(question)
	{
		//TODO resources load and await for clients ready



	}
}