const SIScenario = require('./SIScenario.js');
const SIRight = require('./SIRight.js');

class SIQuestion
{
	constructor(XMLQuestion, theme_) {
		// console.log(XMLQuestion);
		// console.log(XMLQuestion.scenario[0]);
		this.theme = theme_;
		this.price = Number(XMLQuestion.$.price);
		this.scenario = new SIScenario(XMLQuestion.scenario[0], this);
		this.right = new SIRight(XMLQuestion.right[0], this);
		// this.info = new
	}

	getQuestionResources() {
		return this.scenario.getResources();
	}

	getRightResources() {
		return this.right.getResources();
	}

	getInfoResources() {
		return null;
	}

}

module.exports = SIQuestion;