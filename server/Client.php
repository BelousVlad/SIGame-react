<?php

class Client {
	public $lobby;
	public $clientCode;

	public function __construct($code)
	{
		// $this->connection = $connection;
		// $this->server = $server;
		// $this->answerer = new Answerer($this, $server);

		$this->clientCode = $code;



	}

	public function getClientCode(){
		return $this->clientCode;
	}

}

?>