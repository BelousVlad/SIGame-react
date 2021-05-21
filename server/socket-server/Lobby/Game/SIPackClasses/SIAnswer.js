const SIResource = require('./SIResource.js');

class SIAnswer
{
	constructor(XMLAnswer, right_) {
		this.right = right_;
		this.value = XMLAnswer;
		this.resource = new SIResource(this.value, "text");
	}

	getResource() {
		return this.resource;
	}
}

module.exports = SIAnswer;