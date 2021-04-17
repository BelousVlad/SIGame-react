class SIInfo
{
	constructor(XMLInfo, package_) {
		this.package = package_;
		this.authorList = XMLInfo.authors[0].author.map( item => item );
	}
}

module.exports = SIInfo;