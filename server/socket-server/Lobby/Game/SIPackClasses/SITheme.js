const SIQuestion = require('./SIQuestion.js');

class SITheme
{
	constructor(XMLTheme, round_) {
		this.round = round_;
		this.themeName = XMLTheme.$.name;
		this.questionList = XMLTheme.questions[0].question.map( item => new SIQuestion(item, this) );
		this.questionCount = this.questionList.length;
	}
}

module.exports = SITheme;