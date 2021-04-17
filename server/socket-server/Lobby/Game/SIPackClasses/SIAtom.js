class SIAtom
{
	constructor(XMLAtom, scenario_) {
		this.scenario = scenario_;
		this.type = (XMLAtom);
		this.value = XMLAtom._;
	}
}

module.exports = SIAtom;