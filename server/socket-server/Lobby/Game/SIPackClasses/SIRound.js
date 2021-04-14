const SITheme = require('./SITheme.js');

class SIRound
{
	constructor(XMLRound) {
		this.roundName = XMLRound.$.name;
		this.themeList = XMLRound.themes[0].theme.map( item => new SITheme(item) );
	}
}

module.exports = SIRound;