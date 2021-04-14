const SIQuestion = require('./SIQuestion.js');

class SITheme
{
	constructor(XMLTheme) {
		this.themeName = XMLTheme.$.name;
		this.questionList = XMLTheme.questions[0].question.map( item => new SIQuestion(item) );
		this.questionCount = this.questionList.length;
	}
}

module.exports = SITheme;