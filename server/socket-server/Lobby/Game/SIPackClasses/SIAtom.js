class SIAtom
{
	constructor(XMLAtom) {
		this.type = XMLAtom.type;
		this.value = XMLAtom._;
	}
}

module.exports = SIAtom;