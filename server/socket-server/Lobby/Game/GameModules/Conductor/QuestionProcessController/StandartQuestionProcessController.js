const AbstractQuestionProcessController = require('./AbstractQuestionProcessController');
const config = require('../../../../../../config.js');
const Timer = require(config.timerPath);

class StandartQuestionProcessController extends AbstractQuestionProcessController {
	constructor(lobby, game)
	{
		super(lobby, game);
	}

	startQuestion(question)
	{
		//TODO resources load and await for clients ready

		console.log(question);

	}
}

module.exports = StandartQuestionProcessController;
