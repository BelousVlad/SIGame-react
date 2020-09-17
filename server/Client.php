<?php

class Client {
	public $lobby;
	public $connection;
	public $answerer;
	public $server;
	private $clientCode;

	public function __construct($code)
	{
		// $this->connection = $connection;
		// $this->server = $server;
		// $this->answerer = new Answerer($this, $server);

		$this->clientCode = $code;



	}

	public function getClientCode(){
		return $clientCode;
	}

}

?>