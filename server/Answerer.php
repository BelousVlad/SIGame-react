<?php

class Answerer
{

	public $client;
	public $server;
	
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
		if ($msg == "create lobby")
		{
			$this->server->createLobby("test_lobby", 12);
		}
		else if ($msg == "get lobbies")
		{
			$this->send(json_encode($this->server->lobbies));
		}
	}

}


?>