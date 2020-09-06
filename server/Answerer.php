<?php

class Answerer
{

	public $client;
	public $server;

	private static $commands = array(
		"create_lobby" => "createLobby",
		"get_lobbies" => "getLobbies",
	);
	
	public function __construct($client, $server)
	{
		$this->client = $client;
		$this->server = $server;
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

		return;

		if ($msg == "create lobby")
		{
			$this->server->createLobby("test_lobby", 12);
		}
		else if ($msg == "get lobbies")
		{
			$this->send(json_encode($this->server->lobbies));
		}
	}

	private function createLobby($message)
	{
		echo "CREATE LOBBY";

		$data = $message->data;

		$title = $data->title;
		$max = $data->max_players;
		$binary_pack = base64_decode($data->pack);

		$id = $this->server->getNextLobbyId();

		$path = "packs/pack$id.siq";

		file_put_contents($path, $binary_pack);

		$this->server->createLobbyWithId($id, $title, $max, $path);

	}

	private function getLobbies()
	{
		var_dump($this->server->lobbies);
		$this->send(json_encode($this->server->lobbies));
	}

}


?>