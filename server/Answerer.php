<?php

class Answerer
{

	public $client;
	public $server;

	// TODO move field server to Client ;

	private static $commands = array(
		"create_lobby" => "createLobby",
		"get_lobbies" => "getLobbies",
		"part_of_pack" => "getPartOfPack",
		"end_of_pack" => "endPartOfPack",
		"connect_to_lobby" => "connectToLobby",
		"stop" => "stopServer",
		"fast_init" => "fastInit"
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
		echo "CREATE LOBBY";

		$data = $message->data;


		$title = $data->title;
		$max = $data->max_players;
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

		$path = "packs/pack$id.siq";

		$id = $this->server->getNextLobbyId();

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

		$ans->action = $msg->action;
		$ans->data = $this->server->lobbies;

		$this->send(json_encode($ans));
	}

	private function connectToLobby($msg1)
	{
		$msg = json_decode( $msg1 );

		$data = $msg->data;

		$lobby_id = $data->lobby_id;

		$lobby = $this->server->getLobbybyId($lobby_id);

		$key = $lobby->connect($this->client, $msg);

		$ans = [];

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
		createLobby( ["data" => [ "title" => "test", "max_players" => 5 ]] );
	}

}


?>