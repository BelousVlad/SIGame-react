const SIScenario = require('./SIScenario.js');
const SIRight = require('./SIRight.js');

class SIQuestion
{
	constructor(XMLQuestion) {
		this.price = XMLQuestion.price;
		this.scenarioList = XMLQuestion.scenario.map( item => new SIScenario(item) );
		this.rightList = XMLQuestion.right.map( item => new SIRight(item) );
	}
}

module.exports = SIQuestion;