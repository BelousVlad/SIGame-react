class Router{

	constructor(response_manager)
	{
		this.manager = response_manager
	}

	get routes()
	{
		return {
			'set_key': 'set_key',
			'lobby_list' : 'lobby_list',
			'name_set_status' : 'name_set_status',
			'lobby_connected' : 'lobby_connected',
			'lobby_create' : 'lobby_create',
			'question_resources' : 'question_resources',
			'question_stage' : 'question_stage',
			'client_question_reply_request' : 'client_question_reply_request',
			'lobby_id' : 'lobby_id_collected',
			'status' : 'status',
			'update_players' : 'update_players',
			'show_round_info' : 'show_round_info'
		};
	}

	getServerMessage(message)
	{
		console.log(message);
		this.manager[this.routes[message.action]](message);
	}
}