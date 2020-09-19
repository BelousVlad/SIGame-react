<?php

class Answerer // TODO change everywere where field client to fiel con ***
{

	public $con;




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
		"get_clients" => "getClients"
	);

	public function __construct($con)
	{
		$this->con = $con;

		$this->temp_lobby_data = array();
		$this->getting_large_pack_flag = false;// TODO (maybe) change pack_flag to variable in function, not in class
	}


	public function send($msg){
		$this->con->send($msg);
	}

	public function answer($msg)
	{
		echo $msg;
		$message = json_decode($msg);

		$action = $message->action;

		if (!empty($action)) {
			call_user_func(array($this, self::$commands[$action]), $message);
		}
	}

	private $temp_lobby_data;
	private $getting_large_pack_flag;

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

		echo $path;

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

		$ans = (object)[];

		$ans["data"] = $key;

		$ans["action"] = "setPlayerUniqueKey";

		if (!empty($key)) {
			$this->send( json_encode($ans) );
		}

	}

	private function stopServer(){
		die(" -- server has stopped by Administrator");
	}

	private function fastInit(){
		$this->createLobby( ["data" => [ "title" => "test", "max_players" => 5 ]] );
		$this->connectToLobby( (object)[ "data" => [ "lobby_id" => 0 , "name" => "pif1" ] ] );
		$this->connectToLobby( (object)[ "data" => [ "lobby_id" => 0 , "name" => "pif2" ] ] );


	}

	private function sendBroadcast( $msg ){
		$ans = (object)[];
		$ans->action = "view_broadcast";
		$ans->data = $msg;
		$this->con->send( json_encode( $ans ) );
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





	private function checkClientCode( $msg ){

		$code = $msg->data;


		if ( ! ($this->doesClientCodeExist( $code )) ){

			$code = $this->generateClientCode ( 10 ) ;

			array_push ( $this->con->server->clients , new Client( $code ) );

			$ans = (object)[];
			$ans->action = "set_client_code";
			$ans->data = $code;
			$this->con->send( json_encode( $ans ) );

			// echo "\n";
			// print_r( $this->con->server->clients );
		} else {

			$ans = (object)[];
			$ans->action = "client_code_checked";
			$ans->data = "";
			$this->con->send ( json_encode ( $ans ) );
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

	private function generateClientCode( $len ){
		do {
			$code = FuncHelper::random_string( $len );
		} while ( doesClientCodeExist( $code ) )

		return $code;
	}

	private function getClients( $msg ){
		$ans = (object) [];
		$ans->action = "view_clients";
		$ans->data = $this->con->server->clients;
		$this->con->send( json_encode( $ans ) );
	}

	//
	// end of block
	//


}


?>