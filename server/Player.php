<?php

class Player{
	public $unique_key;
	public $name;

	public function __construct($unique_key, $name)
	{
		$this->unique_key = $unique_key;
		$this->name = $name;
	}
}

?>