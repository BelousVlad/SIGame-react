const SIAtom = require('./SIAtom.js');

class SIScenario
{
	constructor(XMLScenario, question_) {
		this.question = question_;
		this.atomList = XMLScenario.atom.map( item => new SIAtom(item, this) );
	}
}

module.exports = SIScenario;