<?php

class GameServer{
	public $clients;
	public $lobbies;

	public function __construct()
	{
		$this->clients = new \SplObjectStorage;
		$this->lobbies = array();
	}


	public function sendToClient($client, $msg) {

		$client->asnwerer->send($msg);

	}

	public function createLobby($title, $max_players)
	{
		array_push($this->lobbies ,new Lobby($title, $max_players) );

	}
}

?>