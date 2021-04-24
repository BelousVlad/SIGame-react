class GameData {
	current_round = 0;
	is_question_used = [ [ [] ] ] // Трёхмерный массисв

	constructor(packInfo)
	{
		let question_list;
		if (packInfo) 
			question_list = packInfo.question_list;

		if (question_list)
		{
			this.setQuestionUsedByTemplate(question_list);
		}
		
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