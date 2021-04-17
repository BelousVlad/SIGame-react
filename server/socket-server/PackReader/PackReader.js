const fs = require('fs'),
	  parseStringToXML = require('xml2js').parseString,
	  SIPackage = require('../Lobby/Game/SIPackClasses/SIPackage.js');

class PackReader //static class
{
	constructor() {};

	async getPackFromFolder(packFolderPath) {

		var package_;

		await parseStringToXML(fs.readFileSync( packFolderPath + '/content.xml' ), function( err, _xml ) {

			package_ = _xml.package;

			if (err)
				package_ = `error`;

		}.bind(this));

		return new SIPackage(package_);
	}

	//return SIRound instance
	getRound(package_, roundIndex) {
		return package_.roundList[roundIndex];
	}

	//return SIAtom instance
	getQuestion(package_, roundIndex, questionIndex) {
		return this.getRound(package_, roundIndex).questionList[questionIndex].scenarioList[0].atomList[0];
	}
}

module.exports = new PackReader;