class ServerSpeakerController{

	constructor(){
		this.speaker = new ServerSpeaker();
	}

	// lobbyConnect(json){
	// 	this.speaker.send ( {action : "connect_to_lobby", "data" : json /* json must have "lobby_id", "name" */ }) ;
	// }

	// getLobbies()
	// {
	// 	this.speaker.send({ action: "get_lobbies" });
	// }

	// stopServer(){
	// 	this.speaker.send ( { action: "stop" } );
	// }

	// createLobby( json ){
	// 	this.speaker.send ( { "action" : "create_lobby", "data" : json } ); /* require title, pass, max_size, path*/
	// }

	// fastInit(){
	// 	this.speaker.send ( { "action" : "fast_init" } );
	// }

	// sendClientCode( code ){
	// 	this.speaker.send ( { "action" : "check_client_code", "data" : code } );
	// }

	// makeSecretCode(  ){
	// 	this.speaker.send ( {"action" : "make_secret_code" } ) ;
	// }

	// getClients (){
	// 	this.speaker.send ( {"action" : "get_clients"} );
	// }

	// setClientName ( name ){
	// 	this.speaker.send ( {"action" : "set_client_name", "data" : name } );
	// }

	// sendFileInfo ( details ){
	// 	this.speaker.send ( {"action" : "handle_file_info", "data" : details } )
	// }

	// sendRequestToUploadFile( data ){
	// 	// alert(3);
	// 	this.speaker.send ( { "action" : "handle_request_to_upload_file", "data" : data } );
	// }

	// sendFile( data ){
	// 	this.speaker.send ( { "action" : "handle_file", "data" : data} );
	// }

	// ping( msg ){
	// 	this.speaker.send ( { "action" : "ping", "data" : msg } );
	// }

	// sendFilePart(msg){
	// 	this.speaker.send ( { "action" : "receive_file_part", "data" : msg } );
	// }

	// sendFileEnd(msg){
	// 	this.speaker.send ( { "action" : "stop_receiving_file", "data" : msg } );
	// }

	initMetaData(msg){
		// this.speaker.send ( {"action" : "init_meta_data", "data" : msg} );
	}

	// initLM( data ){
	// 	this.speaker.send ( {"action" : "init_load_manager", "data" : data } );
	// }

	// testT( data ){
	// 	this.speaker.send ( {"action" : "try_to_sleep", "data" : { "time" : data.time, "data" : data.data } } );
	// }

	checkClientName( data ){
		this.speaker.send ( {action : 'check_client_name', 'data' : { clientName : data } } );
	}

	sendClientKey(key)
	{
		this.speaker.send({action: "key", data: this.key})
	}
	start()
	{
	    this.speaker.openSocket();
	}

	get key()
	{
		return Cookie.get('key') ?? "0";
	}
}