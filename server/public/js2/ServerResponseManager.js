class ServerResponseManager {
	constructor(app)
	{
		this.app = app;
	}

	set_key(msg)
	{
		Cookie.set("key", msg.data);
	}

	lobby_list(msg)
	{
		app.view.showLobbyList(msg.data)
	}

	name_set_status(msg)
	{
		console.log(msg);
	}

	lobby_create(msg)
	{
		console.log(msg)
	}

	//there are methods for lobby processes

	lobby_game_question_resources(msg)
	{
		var data = msg && msg.data || undefined;

		//TODO
	}

	status(msg)
	{
		app.lobby = msg.data.lobby;
		if (app.lobby)
		{
			//this.lobby_connected()
		}
		console.log(msg)
	}

	lobby_connected(msg)
	{
		let code = msg.data.code;
		if (code == 200)
		{
			if (document.location.pathname !== '/lobby')
				document.location.href = '/lobby'
			else
			{

			}
		}
	}

	lobby_id_collected(msg) {
		let lobbyId = parseInt( msg.data );
		console.log(lobbyId);
	}

}