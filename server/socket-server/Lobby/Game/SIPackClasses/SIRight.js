const SIAnswer = require('./SIAnswer.js');

class SIRight
{
	constructor(XMLRight) {
		XMLRight.answerList = XMLRight.answer.map( item => new SIAnswer(item) );
	}
}

module.exports = SIRight;