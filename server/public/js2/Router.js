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
			'question_resources' : 'lobby_game_question_resources',
			'lobby_id' : 'lobby_id_collected',
			'status' : 'status'
		};
	}

	getServerMessage(message)
	{
		this.manager[this.routes[message.action]](message);
	}
}