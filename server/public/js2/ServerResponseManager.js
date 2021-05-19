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

	start_game(msg)
	{
		app.lobby.game = msg.data;
	}

	lobby_id_collected(msg) {
		let lobbyId = parseInt( msg.data );
		console.log(lobbyId);
	}

	show_round_info(msg) {
		this.app.lobby.game.round = msg.data;
	}

	question_resources(msg)
	{
		let data = msg && msg.data;

		console.log(msg.data);
		this.app.lobby.game.loadResources(msg.data)
			.then(() => {
				console.log('loaded')
				this.app.ServerCommandManager.sendReady();
			});
	}

	question_stage(msg)
	{
		this.app.lobby.game.setQuestionStage(msg.data);
	}

	client_question_reply_request(msg) {
		this.app.lobby.game.canReply(msg.data);
	}

	pregame_info(msg) {
		this.app.view.showPregameInfo(msg.data.info.authors, msg.data.time);
	}

	show_round_title(msg) {
		this.app.view.showRoundTitle(msg.data.title, msg.data.time);
	}

	choosing_question(msg) {
		this.app.lobby.game.current_choosing_player = msg.data;
	}

	question_process(msg)
	{
		this.app.lobby.game.questionProcess(msg.data);
	}

	reply_question(msg)
	{
		this.app.lobby.game.replyQuestion(msg.data);
	}
}
