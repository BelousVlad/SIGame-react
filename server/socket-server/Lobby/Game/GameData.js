class GameData {
	current_round = 0;
	is_question_used = [];

	constructor(packInfo)
	{
		if (packInfo.package_template) 
			this.setQuestionUsedByTemplate(packInfo.package_template);

		this.scores = {};
		if (packInfo.clients)
			for(let key in packInfo.clients)
				this.scores[key] = 0;

	}
	setQuestionUsedByTemplate(question_template_list)
	{
		this.is_question_used = question_template_list;
		for(let round of question_template_list)
		{
			for(let theme of round)
			{
				for(let i = 0; i < theme.length; ++i)
				{
					theme[i] = false;
				}
			}
		}
	}

	getUsedRoundQuestions()
	{
		return this.is_question_used[this.current_round];
	}
}

module.exports = GameData;