class Game
{
	constructor(round, view)
	{
		this._view = view;
		this.round = round;
		this._process_text = '';
	}
	set round(val)
	{
		this._round = val;
		this._view.showRoundInfo(val);
	}

	get round() { return this._round }
	set round(data) { 
		this._round = data;
		if (data)
			this._view.viewRoundInfo(data);
	}

	set process_text(text)
	{
		this._process_text = text;
		this._view.showProcessText(text);
	}

}



