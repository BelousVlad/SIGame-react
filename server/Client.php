<?php

class Client {
	public $lobby;
	public $connection;
	public $answerer;
	public $server;

	public function __construct($connection, $server)
	{
		$this->connection = $connection;
		$this->server = $server;
		$this->answerer = new Answerer($this, $server);

// TODO move var server to Client ;

	}

}

?>