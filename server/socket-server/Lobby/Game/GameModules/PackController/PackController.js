const GameModule = require('../GameModule');

class PackController extends GameModule {
	constructor(lobby, game, package_)
	{
		super(lobby, game);
		this.package = package_;
	}

	getPackInfo()
	{
		return this.package.info;
	}

	getPackageTemplate(func = (() => null), questionCheckList) {
		var template_ = new Array();

		for (var i = 0; i < this.package.roundList.length; i++) {

			template_[i] = new Array();

			for (var j = 0; j < this.package.roundList[i].themeList.length; j++) {

				template_[i][j] = new Array();

				for (var k = 0; k < this.package.roundList[i].themeList[j].questionList.length; k++) {
					if (!questionCheckList) {
						template_[i][j][k] = null;
					}
					else {
						if (!questionCheckList[i][j][k]) {
							template_[i][j][k] = func(this.package.roundList[i].themeList[j].questionList[k], this.package.roundList[i].themeList[j], this.package.roundList[i], k, j, i);
						}
						else {
							template_[i][j][k] = null;
						}
					}
					// if(questionCheckList
					// 	&& (!questionCheckList || !questionCheckList[i][j][k]))
					// 	template_[i][j][k] = func(this.package.roundList[i].themeList[j].questionList[k], this.package.roundList[i].themeList[j], this.package.roundList[i], k, j, i);
					// else
					// 	template_[i][j][k] = null;
				}
			}
		}

		return template_;
	}

	getPackageTemplateWithPrices(questionCheckList) {
		return this.getPackageTemplate(function(question_) {
			return question_.price;
		}, questionCheckList)
	}

	getRandomQuestion(questionCheckList, roundIndex) {
		var countOfUnusedQuestions = 0;
		// console.log(roundIndex)
		// console.log(questionCheckList)
		// console.log(this.package.roundList);
		var themeList = this.package.roundList[roundIndex].themeList;

		//counting unused questions
		questionCheckList[roundIndex].forEach( item => item.forEach( item => /*short if-else*/!item ? countOfUnusedQuestions++ : undefined));

		var index = parseInt( Math.random() * countOfUnusedQuestions );
		var count = 0;

		for (var i = 0; i < questionCheckList[roundIndex].length; i++)
			for (var j = 0; j < questionCheckList[roundIndex][i].length; j++)
			{
				if (count === index && !questionCheckList[roundIndex][i][j])
					return themeList[i].questionList[j];

				if (!questionCheckList[roundIndex][i][j])
					count++;
			}
	}

	getRoundIndex(roundSrc) {
		return this.package.roundList.indexOf(roundSrc);
	}

	getThemesTitles(round_ind)
	{
		let round = this.getRound(round_ind);
		let arr = [];

		for(let theme of round.themeList)
		{
			arr.push(theme.themeName);
		}

		return arr;
	}

	getRound(round_ind)
	{
		return this.package.roundList[round_ind];
	}

	getThemeIndex(themeSrc) {
		return themeSrc.round.themeList.indexOf(themeSrc);
	}

	getQuestionIndex(questionSrc) {
		return questionSrc.theme.questionList.indexOf(questionSrc);
	}

	getRoundLocation(roundSrc) {
		for (var roundIndex = 0, round_ = this.package.roundList[0]; roundIndex < this.package.roundList.length; roundIndex++, round_ = this.package.roundList[roundIndex])
			if (roundSrc === round_)
				return {
					roundIndex
				};

		return null;
	}

	getThemeLocation(themeSrc) {
		for (var roundIndex = 0, round_ = this.package.roundList[0]; roundIndex < this.package.roundList.length; roundIndex++, round_ = this.package.roundList[roundIndex])
			for (var themeIndex = 0, theme_ = round_.themeList[0]; themeIndex < round_.themeList.length; themeIndex++, theme_ = round_.themeList[themeIndex])
				if (themeSrc === theme_)
					return {
						roundIndex,
						themeIndex
					};

		return null;
	}

	getQuestionLocation(questionSrc) {
		for (var roundIndex = 0, round_ = this.package.roundList[0]; roundIndex < this.package.roundList.length; roundIndex++, round_ = this.package.roundList[roundIndex])
			for (var themeIndex = 0, theme_ = round_.themeList[0]; themeIndex < round_.themeList.length; themeIndex++, theme_ = round_.themeList[themeIndex])
				for (var questionIndex = 0, question_ = theme_.questionList[0]; questionIndex < theme_.questionList.length; questionIndex++, question_ = theme_.questionList[questionIndex])
					if (questionSrc === question_)
						return {
							roundIndex,
							themeIndex,
							questionIndex
						};

		return null;
	}

	getItemByIndexes(roundIndex, themeIndex, questionIndex) {
		return this.getItemByLocation({
			roundIndex,
			themeIndex,
			questionIndex
		});
	}

	getItemByLocation(location_) {
		var { roundIndex, themeIndex, questionIndex } = location_;

		// console.log('LOCATION ', { roundIndex, themeIndex, questionIndex });

		if (questionIndex !== undefined)
			return this.package.roundList[roundIndex].themeList[themeIndex].questionList[questionIndex];

		if (themeIndex !== undefined)
			return this.package.roundList[roundIndex].themeList[themeIndex];

		if (roundIndex !== undefined)
			return this.package.roundList[roundIndex];

		return null;
	}

	getRoundType(roundIndex)
	{
		return this.package.roundList[roundIndex].type;
	}
}

module.exports = PackController;