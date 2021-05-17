class Game
{
	constructor(round, view, current_choosing_player)
	{
		this._view = view;
		this._round = round;
		this._process_text = '';
		this._current_choosing_player = current_choosing_player; /* possible values: null, {player_name: string, is_you: boolean} */
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


	get current_choosing_player() { return this._current_choosing_player; }
	set current_choosing_player(data)
	{
		this._current_choosing_player = {
			player_name: data.player_name,
			is_you: data.is_you
		};
	}

	loadResources()
	{
		return new Promise((resolve, reject) => {
			
		})
	}

}



