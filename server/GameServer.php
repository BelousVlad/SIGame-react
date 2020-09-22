<?php



class GameServer{
	public $clients;
	public $lobbies;

	private $id = 0;



	public function __construct()
	{
		// $pack_folder = dirname(__FILE__)."/testpacks";
		// $this->clearDir( $pack_folder );
		$this->clients = array();
		$this->lobbies = array();
	}


	public function sendToClient($client, $msg) {

		$client->asnwerer->send($msg);

	}

	public function createLobbyWithId($id ,$title, $max_players, $path_to_pack)
	{
		array_push($this->lobbies, new Lobby($id,$title,$max_players,$path_to_pack));
	}

	public function createLobby($title, $max_players, $path_to_pack)
	{
		//array_push($this->lobbies ,new Lobby($title, $max_players) );
	}

	public function getLobbyById($id)
	{

		foreach ($this->lobbies as $item) {
			if ($item->id == $id) {
				return $item;
			}
		}

		return null;
	}

	public function getNextLobbyId()
	{
		return $this->id++;
	}

	private function clearDir( $path){
		$arr = scandir( $path );
		$arr = \array_diff( $arr, [".", ".."] );
		foreach( $arr as $key ){
			unlink( "$path/$key" );
		}
	}

}

?>