<?php

class Client {
	public $lobby;
	public $connection;
	public $answerer;

	public function __construct($connection, $server)
	{
		$this->connection = $connection;
		$this->answerer = new Answerer($this, $server);

// TODO move var server to Client ;

	}

}

?>