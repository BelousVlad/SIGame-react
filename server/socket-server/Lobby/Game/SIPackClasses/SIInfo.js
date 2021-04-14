class SIInfo
{
	constructor(XMLInfo) {
		this.authorList = XMLInfo.authors[0].author.map( item => item );
	}
}

module.exports = SIInfo;