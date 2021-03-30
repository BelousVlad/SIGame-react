class Lobby{
	constructor(title, max_players, is_host, is_master)
	{
		this.title = title;
		this.max_players = max_players;
		this.players_ = [];
		this.is_host = is_host;
		this.is_master = is_master;

		app.view_model.addLobbyInfoField('title', { title: 'Назва', value: title } );
		app.view_model.addLobbyInfoField('max_players', { title: 'Кількість гравців', value: max_players } );
		app.view_model.showMainParagraph();
	}

	set players(players)
	{
		this.players_ = players

		app.view_model.viewPlayers(players, this.is_host, this.is_master)
	}

	addPlayer(pl)
	{
		this.players_.push(pl);

		app.view_model.viewPlayers(this.players_, this.is_host, this.is_master)
	}

	getPlayerByName(name)
	{
		for(let player of this.players_)
		{
			if (player.name == name)
			{
				return player;
			}
		}
	}

	setMasterByName(name)
	{
		for(let player of this.players_)
		{
			if (player.name == name)
			{
				player.is_master = true;;
			}
			else if (player.is_master)
			{
				player.is_master = false;
			}
			
		}
		if (name == app.client_name)
		{
			this.is_master = true;
		}
		else
		{
			this.is_master = false;
		}

		app.view_model.viewPlayers(this.players_, this.is_host, this.is_master)
	}

	removeMaster()
	{
		for(let player of this.players_)
		{
			player.is_master = false;
		}
		app.view_model.viewPlayers(this.players_, this.is_host, this.is_master)	
	}

	changeScore(player, score)
	{
		if (this.players_.includes(player))
		{
			player.score = score;
		}

		// TODO change one to draw one player
		app.view_model.viewPlayers(this.players_, this.is_host, this.is_master)
	}

	removePlayer(player)
	{
		let index = this.players_.indexOf(player)
		if (index != -1)
			this.players_.splice(index, 1);
		app.view_model.viewPlayers(this.players_, this.is_host)
	}

	removePlayerByName(p_name)
	{
		for(let player of this.players_)
		{
			if (player.name == p_name)
			{
				let index = this.players_.indexOf(player)
				this.players_.splice(index, 1);
			}
		}
		app.view_model.viewPlayers(this.players_, this.is_host, this.is_master)
	}

	renderFullInterface()
	{
		app.view_model.viewPlayers(this.players_, this.is_host, this.is_master)
	}


}