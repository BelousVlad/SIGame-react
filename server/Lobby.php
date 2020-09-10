<?php

class Lobby{

	public $id; 
	public $title;
	public $max_players;
	public $path;
	public $players;

	public function __construct($id, $title, $max_players, $path)
	{
		$this->id = $id;
		$this->title = $title;
		$this->max_players = $max_players;
		$this->players = array();
	}

	public function connect($client, $json)
	{
		$json = json_decode($json);

		$str = $json->key;

		if (empty($str)) { //new player

			$str = self::random_string(7);
			$name = $json->name;

			$player = new Player($str, $name);

			array_push($this->players, $player);

			return true;
		}

		return false;
	}

	private static function random_string($length_of_string) { 
    	return substr( md5( time() ), 0, $length_of_string ); 
	} 

}

?>