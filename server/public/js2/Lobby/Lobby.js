class Lobby {
	constructor(info, players, position, view)
	{
		this.info = info;
		this._view = view;
		this._position = position;
		this.players = players;

		this._game = undefined;
		if (info.is_game)
		{
			this.game = info.game;
		}
	}

	get players() { return this._players }
	set players(data) { 
		this._players = data;
		this._view.renderPlayers(this._players, this._position);
		if (!this.hasMaster)
		{
			this._view.renderBecameMasterBtn();
		}
	} //mb TODO

	get info() { return this._info }
	set info(data) {
		this._info = data
	} //mb TODO

	get position() { return this._position }
	set position(data) { this._position = data } //mb TODO

	get hasMaster()
	{
		return !!this._players.find((item) => item.is_master == true );
	}

	get game() { return this._game }
	set game(data) {
		this._game = new Game(data.round_info, this._view)
		if (data.current_process)
		{
			if (data.current_process.process === 'ask_reply_process')
			{
				this._game.canReply(data.current_process)
			}
			else if (data.current_process.process === 'reply_process')
			{
				this._game.questionProcess(data.current_process)
				if (data.current_process.is_reply)
					this._game.replyQuestion(data.current_process)
			}
		}
	}
}