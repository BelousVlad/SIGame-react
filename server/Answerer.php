<?php

class Answerer
{

	public $client;
	public $server;

	// TODO move field server to Client ;

	private function dummy(){};

	private static $commands = array(
		"check_client_code" => "dummy",
		"create_lobby" => "createLobby",
		"get_lobbies" => "getLobbies",
		"part_of_pack" => "getPartOfPack",
		"end_of_pack" => "endPartOfPack",
		"connect_to_lobby" => "connectToLobby",
		"stop" => "stopServer",
		"fast_init" => "fastInit",
		"make_secret_code" => "makeSecretCode"
	);

	public function __construct($client, $server)
	{
		$this->client = $client;
		$this->server = $server;
		$this->temp_lobby_data = array();
		$this->getting_large_pack_flag = false;// TODO (maybe) change pack_flag to variable in function, not in class
	}


	public function send($msg){
		$this->client->connection->send($msg);
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

		$id = $this->server->getNextLobbyId();

		$path = "packs/pack$id.siq";

		echo $path;

		$this->server->createLobbyWithId($id, $title, $max, $path);

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

			$id = $this->server->getNextLobbyId();

			$path = "packs/pack$id.siq";

			file_put_contents($path, $binary_pack);

			$this->server->createLobbyWithId($id, $title, $max, $path);
		}
	}

	private function getLobbies($msg)
	{

		var_dump($this->server->lobbies);

		// $ans = [];
		$ans->action = $msg->action;
		$ans->data = $this->server->lobbies;

		$this->send(json_encode($ans));
	}

	private function connectToLobby($msg)
	{


		$data = (object) ($msg->data);



		$lobby_id = $data->lobby_id;

		// echo "$lobby_id --- \n";

		$lobby = $this->server->getLobbybyId($lobby_id);

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

	private function makeSecretCode(){
		$ans = (object)[];
		$ans->data = 123;//rundom_code(); //TODO function
		$ans->action = "set_secret_code";

		$this->send ( json_encode( $ans ) );
	}

}


?>