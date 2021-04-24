const SIResource = require('./SIResource.js');

class SIAtom
{
	constructor(XMLAtom, scenario_) {
		this.scenario = scenario_;
		this.type = "say"; // TODO
		// this.type = (XMLAtom.type);
		this.value = XMLAtom._;

		this.resource = new SIResource(this.value, this.type);
	}

	getResource() {
		return this.resource;
	}
}

module.exports = SIAtom;