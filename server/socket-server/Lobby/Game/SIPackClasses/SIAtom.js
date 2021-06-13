const SIResource = require('./SIResource.js');

class SIAtom
{
	constructor(XMLAtom, scenario_) {
		this.scenario = scenario_;
		if (typeof XMLAtom === 'string')
		{
			this.type = "say";
			this.value = XMLAtom;
		}
		else
		{
			this.type = "say"; // TODO
			// this.type = (XMLAtom.type);
			this.value = XMLAtom._;
		}
		this.resource = new SIResource(this.value, this.type);
	}

	getResource() {
		return this.resource;
	}
}

module.exports = SIAtom;