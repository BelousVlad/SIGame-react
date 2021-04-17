class SIAnswer
{
	constructor(XMLAnswer, right_) {
		this.right = right_;
		this.value = XMLAnswer._;
	}
}

module.exports = SIAnswer;