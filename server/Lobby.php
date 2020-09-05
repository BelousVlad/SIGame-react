<?php

class Lobby{

	public $title;
	public $max_players;

	public function __construct($title, $max_players)
	{
		$this->title = $title;
		$this->max_players = $max_players;
	}

}

?>