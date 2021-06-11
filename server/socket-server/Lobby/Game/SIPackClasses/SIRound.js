const SITheme = require('./SITheme.js');

class SIRound
{
	constructor(XMLRound, package_) {
		this.package = package_;
		this.roundName = XMLRound.$.name;
		this.themeList = XMLRound.themes[0].theme.map( item => new SITheme(item, this) );

		this.type = ''; /* possibilitiets 'final', 'regular' */

		switch (XMLRound.$.type)
		{
			case 'final':
			this.type = 'final';
			break;

			default:
			this.type = 'regular';
		}
	}
}

module.exports = SIRound;