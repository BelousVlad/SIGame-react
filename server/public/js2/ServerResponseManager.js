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
		this.app.view.showLobbyList(msg.data)
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

	update_players(msg)
	{
		if (msg.data)
		{
			this.app.lobby.players = msg.data;
		}
	}

	status(msg)
	{

		if (msg.data.lobby)
		{
			this.lobby_connected({ data: {
					code: 200,
					lobby: msg.data.lobby
				}
			})
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
				this.app.lobby = msg.data.lobby;
			}
		}
	}

	lobby_id_collected(msg) {
		let lobbyId = parseInt( msg.data );
		console.log(lobbyId);
	}

	show_round_info(msg) {
		// msg.data is object which looks like {themes: [...], prices: [...]}
		this.app.view.viewRoundInfo(msg.data);
	}

	question_resources(msg)
	{
		var data = msg && msg.data;

		 this.app.currentQuestionResources = new Object;
		/*
		await for resources loaded
		 */

		 this.app.ServerCommandManager.sendReady();
	}

	question_stage(msg)
	{
		var index = msg && msg.data && msg.data.stage_number;
		console.log('current index is: ', index, ', with time: ', msg.data.time);
		// TODO
		// something like this.app.view.viewQuestionResource( this.app.currentQuestionResources, index)
	}

	client_question_reply_request(msg) {
		var time = msg.data.time

		this.app.view.enableAnswerButton()
		setTimeout(() => this.app.view.disableAnswerButton(), time)
	}
}

// question_resources | incomplete
// lobby.game.client_ready | done
// question_stage {data: {stage_number: 0, time: 10}}; | incomplete
// client_question_reply_request {data: {time: 10}}; | incomplete
// lobby.game.ask_to_reply