class Lobby{
	constructor(title, max_players, is_host)
	{
		this.title = title;
		this.max_players = max_players;
		this.players_ = [];
		this.is_host = is_host;
	}

	set players(players)
	{
		this.players_ = players

		app.view_model.viewPlayers(players, this.is_host)
	}

	addPlayer(pl)
	{
		this.players_.push(pl);

		app.view_model.viewPlayers(this.players_, this.is_host)
	}

	renderFullInterface()
	{
		app.view_model.viewPlayers(this.players_, is_host)
	}


}