class GameData {
	current_round_index = 0;
	is_question_used = [ [ [] ] ] // Трёхмерный массисв

	constructor(packInfo)
	{
		if (packInfo) 
			let question_list = packInfo.question_list;

		if (question_list)
		{
			this.setQuestionUsedByTemplate(question_list);
		}
		
	}
	setQuestionUsedByTemplate(question_template_list)
	{
		this.setQuestionUsedByTemplate = question_template_list;
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



}