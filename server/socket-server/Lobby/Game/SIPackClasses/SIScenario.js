const SIAtom = require('./SIAtom.js');

class SIScenario
{
	constructor(XMLScenario) {
		this.atomList = XMLScenario.atom.map( item => new SIAtom(item) );
	}
}

module.exports = SIScenario;