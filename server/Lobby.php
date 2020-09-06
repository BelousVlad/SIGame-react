<?php

class Lobby{

	public $id; 
	public $title;
	public $max_players;
	public $path;

	public function __construct($id, $title, $max_players, $path)
	{
		$this->id = $id;
		$this->title = $title;
		$this->max_players = $max_players;
	}

}

?>