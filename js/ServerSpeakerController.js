class ServerSpeakerController{

	constructor(){
		this.speaker = new ServerSpeaker();
	}

	lobbyConnect(json){
		this.speaker.send ( {action : "connect_to_lobby", "data" : json /* json must have "lobby_id", "name" */ }) ;
	}

	getLobbies()
	{
		this.speaker.send({ action: "get_lobbies" });
	}

	stopServer(){
		this.speaker.send ( { action: "stop" } );
	}

	createLobby( json ){
		this.speaker.send ( { "action" : "create_lobby", "data" : json } ); /* require title, pass, max_size, path*/
	}

	fastInit(){
		this.speaker.send ( { "action" : "fast_init" } );
	}

	sendClientCode( code ){
		this.speaker.send ( { "action" : "check_client_code", "data" : code } );
	}

	makeSecretCode(  ){
		this.speaker.send ( {"action" : "make_secret_code" } ) ;
	}

	getClients (){
		this.speaker.send ( {"action" : "get_clients"} );
	}

}