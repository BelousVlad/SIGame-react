const SIRound = require('./SIRound.js');
const SIInfo = require('./SIInfo.js');

class SIPackage
{
	constructor(XMLPackage) {

		//fields like name, date, etc...
		Object.assign(this, XMLPackage.$);

		this.info = new SIInfo( XMLPackage.info[0] );
		this.roundList = XMLPackage.rounds[0].round.map( item => new SIRound(item) );
	}
}

module.exports = SIPackage;