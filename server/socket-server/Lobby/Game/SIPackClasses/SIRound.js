const SITheme = require('./SITheme.js');

class SIRound
{
	constructor(XMLRound, package_) {
		this.package = package_;
		this.roundName = XMLRound.$.name;
		this.themeList = XMLRound.themes[0].theme.map( item => new SITheme(item, this) );
	}
}

module.exports = SIRound;