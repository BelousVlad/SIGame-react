const SIScenario = require('./SIScenario.js');
const SIRight = require('./SIRight.js');

class SIQuestion
{
	constructor(XMLQuestion, theme_) {
		this.theme = theme_;
		this.price = XMLQuestion.$.price;
		this.scenarioList = XMLQuestion.scenario.map( item => new SIScenario(item, this) );
		this.rightList = XMLQuestion.right.map( item => new SIRight(item, this) );
	}
}

module.exports = SIQuestion;