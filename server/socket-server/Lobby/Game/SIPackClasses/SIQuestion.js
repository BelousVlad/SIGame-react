const SIScenario = require('./SIScenario.js');
const SIRight = require('./SIRight.js');

class SIQuestion
{
	constructor(XMLQuestion, theme_) {
		this.theme = theme_;
		this.price = XMLQuestion.$.price;
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