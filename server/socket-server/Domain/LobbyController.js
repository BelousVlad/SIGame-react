const DomainController = require('./DomainController');

class LobbyController extends DomainController{
	constructor()
	{
		super({
			
		})
	}

	get_lobbies(ws, msg)
	{
		let lobbies_ = LobbyManager.lobbies;

		let lobbies = [];

		for(let item in lobbies_)
		{
			let lobby = lobbies_[item];
			lobbies.push({
				title: lobby.title,
				max_players: lobby.max_players,
				players_count: Object.keys( lobby.clients ).length,
				is_password: Boolean(lobby.password)
			});
		}

		this.send(ws,'lobby_list', lobbies);
	}
}

module.exports = LobbyController;