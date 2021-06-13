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
			'show_round_info' : 'show_round_info',
			'start_game' : 'start_game',
			'pregame_info' : 'pregame_info',
			'show_round_title' : 'show_round_title',
			'choosing_question' : 'choosing_question',
			'question_process': 'question_process',
			'reply_question' : 'reply_question',
			'question_answers': 'question_answers',
			'set_position' : 'set_position',
			'lobby_chat_message': 'lobby_chat_message',
			'make_bet' : 'make_bet',
			'lobby_leave' : 'lobby_leave'
		};
	}

	getServerMessage(message)
	{
		console.log(message);
		this.manager[this.routes[message.action]](message);
	}
}