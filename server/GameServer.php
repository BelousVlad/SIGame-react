<?php

class GameServer{
	public $clients;
	public $lobbies;

	private $id = -1;

	public function __construct()
	{
		$this->clients = new \SplObjectStorage;
		$this->lobbies = array();
	}


	public function sendToClient($client, $msg) {

		$client->asnwerer->send($msg);

	}

	public function createLobbyWithId($id ,$title, $max_players, $path_to_pack)
	{
		array_push($this->lobbies, new Lobby($id,$title,$max_players,$path_to_pack));
	}

	public function createLobby($title, $max_players, $path_to_pack)
	{
		//array_push($this->lobbies ,new Lobby($title, $max_players) );


	}

	public function getNextLobbyId()
	{
		return count($this->lobbies);
	}

}

?>