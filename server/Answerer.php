<?php

class Answerer // TODO change everywere where field client to fiel con ***
{

	public $con;
	public $meta_data_isset = false;




	// private function dummy(){};

	private static $commands = array(
		"check_client_code" => "checkClientCode",
		"create_lobby" => "createLobby",
		"get_lobbies" => "getLobbies",
		"part_of_pack" => "getPartOfPack",
		"end_of_pack" => "endPartOfPack",
		"connect_to_lobby" => "connectToLobby",
		"stop" => "stopServer",
		"fast_init" => "fastInit",
		"make_secret_code" => "makeSecretCode",
		"get_clients" => "getClients",
		"set_client_name" => "setClientName",
		"get_client_by_code" => "sendClientByCode",
		"handle_file_info" => "handleFileInfo",
		"handle_request_to_upload_file" => "handleRequestToUploadFile",
		"handle_file" => "handleFile",
		"ping" => "pong",
		"receive_file_part" => "receiveFilePart",
		"stop_receiving_file" => "stopReceivingFile",
		"init_meta_data" => "initMetaData",
		"init_load_manager" => "initLM",
		"try_to_sleep" => "tryToSleep"
	);

	public function __construct($con)
	{
		$this->con = $con;

		$this->temp_lobby_data = array();
		$this->getting_large_pack_flag = false;// TODO (maybe) change pack_flag to variable in function, not in class
	}


	public function send($msg){
		$this->con->send( json_encode ($msg ) );
	}

	public function answer($msg)
	{

		// $this->sendBroadcast( $msg );

		// echo $msg;

		$message = json_decode($msg);

		$action = $message->action;
		$action = !empty($action) ? $action : die("empty action received");

		if ( $this->meta_data_isset ){
				call_user_func(array($this, self::$commands[$action]), $message);
		} else {
			if ( $action == "init_meta_data" ){
				$this->initMetaData($message);
			}
		}
	}

	// private $temp_lobby_data;
	// private $getting_large_pack_flag;

	private function initMetaData( $msg ){

		// $this->sendBroadcast(3);

		$data = $msg->data;
		$ans = (object)[
			"action" => "call_actions_array",
			"data" => (object)[]
		];
		$actEnd = (object)[
			"action" => "resolve_meta_data"
		];
		$ans->data->actionList = array();
		array_push( $ans->data->actionList, $this->checkClientCode( $data->client_code ) );
		array_push( $ans->data->actionList, $actEnd );

		$this->meta_data_isset = true;

		$this->send ( $ans );

	}

	private function createLobby($message)
	{
		echo "CREATE LOBBY \n";

		$data = ( (object ) ((object)$message)->data );

		// print_r( $data );

		$title = $data->title;
		$max = $data->max_players;

		// echo $title;

		// echo 1;
/*
		if ($data->pack == "large_pack") {

			echo "large_pack";

			$this->getting_large_pack_flag = true;

			$this->temp_lobby_data["title"] = $title;
			$this->temp_lobby_data["max"] = $max;
			$this->temp_lobby_data["pack"] = "";

		}
		else
		{

			$binary_pack = base64_decode($data->pack);

			//$id = $this->server->getNextLobbyId();

			//$path = "packs/pack$id.siq";

			file_put_contents($path, $binary_pack);

			//$this->server->createLobbyWithId($id, $title, $max, $path);
		}
*/

		$id = $this->con->server->getNextLobbyId();

		$path = "packs/pack$id.siq";

		// echo $path;

		$this->con->server->createLobbyWithId($id, $title, $max, $path);

	}

	private function getPartOfPack($msg)
	{
		if ($this->getting_large_pack_flag) {
			$this->temp_lobby_data["pack"] .= $msg->data;
		}
	}

	private function endPartOfPack($msg)
	{
		if ($this->getting_large_pack_flag) {
			$this->getting_large_pack_flag = false;

			$title = $this->temp_lobby_data["title"];
			$max =   $this->temp_lobby_data["max"];
			$pack =  $this->temp_lobby_data["pack"];

			$binary_pack = base64_decode($pack);

			$id = $this->con->server->getNextLobbyId();

			$path = "packs/pack$id.siq";

			file_put_contents($path, $binary_pack);

			$this->con->server->createLobbyWithId($id, $title, $max, $path);
		}
	}

	private function getLobbies($msg)
	{

		var_dump($this->con->server->lobbies);

		// $ans = [];
		$ans->action = $msg->action;
		$ans->data = $this->client->server->lobbies;

		$this->send(json_encode($ans));
	}

	private function connectToLobby($msg)
	{


		$data = (object) ($msg->data);



		$lobby_id = $data->lobby_id;

		// echo "$lobby_id --- \n";

		$lobby = $this->con->server->getLobbybyId($lobby_id);

		$key = $lobby->connect($this->client, $data);

		// $ans = (object)[];

		// $ans["data"] = $key;

		// $ans["action"] = "setPlayerUniqueKey";

		// if (!empty($key)) {
		// 	$this->send( json_encode($ans) );
		// }

	}

	private function stopServer(){
		die(" -- server has stopped by Administrator");
	}

	private function fastInit(){
		$this->createLobby( ["data" => [ "title" => "test", "max_players" => 5 ]] );
		$this->connectToLobby( (object)[ "data" => [ "lobby_id" => 0 , "name" => "pif1" ] ] );
		$this->connectToLobby( (object)[ "data" => [ "lobby_id" => 0 , "name" => "pif2" ] ] );


	}

	public function sendBroadcast( $msg ){ // TODO make method private
		$ans = (object)[];
		$ans->action = "view_broadcast";
		$ans->data = $msg ;
		$this->con->send( json_encode( $ans ) );
	}

	private function pong( $msg ){
		$this->sendBroadcast( $msg );
	}

	private function clearDirectory( $path ){
		// $arr = scandir($path);
		// foreach ( $arr as $key ){
		// 	unlink(  )
		// }
	}

	//
	//  SecretCodeBlock
	//

	// private function makeSecretCode(){
	// 	$ans = (object)[];
	// 	$ans->data = 123;//rundom_code(); //TODO function
	// 	$ans->action = "set_secret_code";

	// 	// $this->client->secretCode = $ans->data;  TODO
	// 	//

	// 	$this->send ( json_encode( $ans ) );
	// }

	private function checkClientCode( $code ){

		// $code = $msg->data;


		if ( ! ($this->doesClientCodeExist( $code )) ){

			$code = $this->generateClientCode ( 10 ) ;

			$client = new Client( $code );

			$this->con->client = $client;

			array_push ( $this->con->server->clients , $client );

			$ans = (object)[];
			$ans->action = "set_client_code";
			$ans->data = $code;
			return $ans;

			// echo "\n";
			// print_r( $this->con->server->clients );
		} else {

			$this->con->client = $this->getClientByCode( $code );

			$ans = (object)[];
			$ans->action = "dummy";
			$ans->data = "";
			return $ans;
		}
	}

	private function doesClientCodeExist( $code ){

		if ( $code == 'NULL' ){
			return false;
		}

		foreach( $this->con->server->clients as $key ){
			if ( $key->getClientCode() == $code ){
				return true;
			}
		}

		return false;

	}

	private function getClientByCode( $code ){

		if ( $code == 'NULL' ){
			return false;
		}

		foreach( $this->con->server->clients as $key ){
			if ( $key->getClientCode() == $code ){
				return $key;
			}
		}

		return false;

	}


	private function generateClientCode( $len ){
		do {
			$code = FuncHelper::random_string( $len );
		} while ( $this->doesClientCodeExist( $code ) );

		return $code;
	}

	private function getClients( $msg ){
		$ans = (object) [];
		$ans->action = "view_clients";
		$ans->data = $this->con->server->clients;
		$this->con->send( json_encode( $ans ) );
	}

	private function sendClientByCode ( $msg ){  //TODO
		$this->con->send ();
	}

	private function setClientName( $name ){
		$this->con->client->userName = $name;
	}


	// private function handleFileInfo ( $msg ){
	// 	$details = $msg->details;

	// 	const max_size = 3 * 10000;

	// 	if ( $details->size <= max_size ){
	// 		$ans = (object)[];
	// 		$ans->action = "send_current_file";
	// 		$ans->data = "";

	// 		$this->con->send( $ans )
	// 	} else {
	// 		$parts = ceil ($details->size / max_size );
	// 	}
	// }

	private function handleRequestToUploadFile( $msg ){


		// TODO checkout of load_manager_id be less then some number ( for example 5);

		$details = $msg->data->details;
		$size = $details->size;
		$type = $details->type;
		$lmId = $details->load_manager_id;
		$clientId = $this->con->client->getClientCode();

		// $this->sendBroadcast( json_encode ( $msg->data->details ) );

		// $this->initLM( $lmId );

		file_put_contents( "testpacks/sipack _ $clientId _ $lmId _ .rar", "" );

		$ans = (object)[];

		if ( $type == "question-pack" ){
			if ( $size > 0 ){ // TODO comparing with max_pack_size
				$ans->action = "task_to_certain_lm";
				$ans->data = (object)[];
				$ans->data->load_manager_id = $lmId;
				$ans->data->action_of_lm = "start_uploading_file_by_parts";
				$ans->data->asnwer = "";

				$this->send( $ans );

			} else {
				;
			}
		} else if ( $type == "avatar-image" ) {
			;
		}

	}

	////////////////
	///

	private function initLM( $msg ){

		$id = $msg->data->id;
		$type = $msg->data->type;

		// if ( array_key_exists( $id, $this->con->lmList->tempData ) ) // --------- flaf ----
		$lm = (object)[];
		$lm ->type = $type;
		$lm ->tempData = array();
		$lm ->tempData['FileParts'] = array();

		$this->con->lmList += [$id => $lm];

		var_dump ( $this->con->lmList );

		// $this->sendBroadcast ( $lmId );
	}


	//////////////////

	private function receiveFilePart( $msg ){
		$details = $msg->data->details;
		$size = $details->size;
		$type = $details->type;
		$lmId = $details->load_manager_id;
		$filePartContent = $msg->data->filePart;

		// $this->sendBroadcast( json_encode ( $this->con->lmList[$lmId] ) );

		if ( ! is_array ( $this->con->lmList[$lmId]->tempData['FileParts'] ) ){
			$arr = $this->con->lmList[$lmId]->tempData['FileParts'] = array();
			// $this->sendBroadcast( json_encode( [] ) );
		}

		// $this->con->lmList[$lmId]->tempData['FileParts'] = is_array ($this->con->lmList[$lmId]->tempData['FileParts']) ? $this->con->lmList[$lmId]->tempData['FileParts'] : array();
		// $this->sendBroadcast( $lmId ) ;


		array_push ( $this->con->lmList[$lmId]->tempData['FileParts'] , $filePartContent );

	}

	private function stopReceivingFile( $msg ){
		$details = $msg->data->details;
		$size = $details->size;
		$type = $details->type;
		$lmId = $details->load_manager_id;

		// $this->sendBroadcast ( $lmId );

		// $this->sendBroadcast( json_encode( $this->con->lmList[$lmId] ) );

		$this->con->lmList[$lmId]->File = implode( '' , $this->con->lmList[$lmId]->tempData['FileParts'] );

		$msg->data->file = $this->con->lmList[$lmId]->File;

		$this->handleFile ( $msg );
	}

	private function handleFile( $msg ){
		$details = $msg->data->details;
		$size = $details->size;
		$type = $details->type;
		$lmId = $details->load_manager_id;
		$fileContent = $msg->data->file;

		$ans = (object)[];
		$fileContent = str_replace(' ','+',$fileContent);
		$fileContent = base64_decode($fileContent);

		$clientId = $this->con->client->getClientCode();
		$filew = fopen( "testpacks/sipack _ $clientId _ $lmId _ .rar", "w" );
		fwrite( $filew, $fileContent );
		fclose( $filew );
	}

	private function isFileOk(){
		;
	}

	//
	// end of block
	//

	private function tryToSleep( $msg ){
		$data = $msg->data;
		$time = (int)$data->time;
		sleep($time);
		$answer = $this->sendBroadcast($msg->data->data);
	}

}



?>