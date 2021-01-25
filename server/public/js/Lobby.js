class Lobby{
	constructor(title, max_players)
	{
		this.title = title;
		this.max_players = max_players;
		this.players = [];
	}

	set players(players)
	{
		this.players_ = players

		app.view_model.viewPlayers(players)
	}
}