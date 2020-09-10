<?php

class Answerer
{

	public $client;
	public $server;

	private static $commands = array(
		"create_lobby" => "createLobby",
		"get_lobbies" => "getLobbies",
		"part_of_pack" => "getPartOfPack",
		"end_of_pack" => "endPartOfPack",
		"connect_to_lobby" => "connectToLobby"
	);
	
	public function __construct($client, $server)
	{
		$this->client = $client;
		$this->server = $server;
		$this->temp_lobby_data = array();
		$this->getting_large_pack_flag = false;
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

			$id = $this->server->getNextLobbyId();

			$path = "packs/pack$id.siq";

			file_put_contents($path, $binary_pack);

			$this->server->createLobbyWithId($id, $title, $max, $path);
		}


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

	private function getLobbies()
	{
		$this->send(json_encode($this->server->lobbies));
	}

	private function connectToLobby($msg)
	{
		$data = $msg->data;

		$lobby_id = $data->lobby_id;

		$lobby = $this->server->getLobbybyId($lobby_id);

		$key = $lobby->connect($this->client, $msg);

		if (!empty($key)) {
			$this->send($key);
		}

	}

}


?>