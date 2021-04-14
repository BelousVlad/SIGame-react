class SIAtom
{
	constructor(XMLAtom) {
		this.type = (XMLAtom);
		this.value = XMLAtom._;
	}
}

module.exports = SIAtom;