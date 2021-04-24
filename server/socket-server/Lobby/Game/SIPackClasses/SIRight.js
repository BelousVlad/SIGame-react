const SIAnswer = require('./SIAnswer.js');

class SIRight
{
	constructor(XMLRight, question_) {
		this.question = question_;
		XMLRight.answerList = XMLRight.answer.map( item => new SIAnswer(item, this) );
	}

	getResources() {
		return this.answerList.map(item => item.getResource());
	}
}

module.exports = SIRight;