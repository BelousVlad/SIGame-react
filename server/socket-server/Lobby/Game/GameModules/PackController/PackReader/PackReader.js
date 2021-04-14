const fs = require('fs'),
	  parseStringToXML = require('xml2js').parseString,
	  SIPackage = require('../../../SIPackClasses/SIPackage.js');

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

var pr = new PackReader;
pr.getPackFromFolder(`D:\\open server\\OpenServer\\domains\\sigame\\server\\si-packs\\pack1`).then(res => console.log(res.roundList[0].themeList[0].questionList[0].scenarioList[0].atomList[0].type));

module.exports = new PackReader;