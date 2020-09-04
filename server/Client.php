<?

class Client {
	public $lobby;
	public $connection;
	public $answerer;

	public function __construct($connection)
	{
		$this->connection = $connetion;
		$this->answerer = new Answerer($this);
	}

}

?>