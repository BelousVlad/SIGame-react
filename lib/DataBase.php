<?
class DataBase{

	public static $connection;



	public static function getConnection()
	{
		if (is_null($connection)) {
			$connection = mysqli_connect("localhost","root","root","sigame");
		}
		return $connection;
	}

	public static function closeConnection(){
		if (!(is_null($connection))) {
			$connection->close();
		}
	}

	public function getLobbies()
	{
		$con = self::getConnection();

		$sql = "SELECT * FROM lobbies";

		$arr = [];

		$result = $con->query($sql);



		if ( $result ->num_rows > 0){
			while ( $row = $result->fetch_assoc()){
				array_push($arr,$row);
			}
		}
		else {
			$arr = "0 results";
		}


		return $arr;
	}

	public function addLobby($lobby)
	{
		$con = self::getConnection();

		$sql = "INSERT INTO `lobbies` (`title`, `path`, `password`, `max_size`, `current_round`) VALUES (?, ?, ?, ?, 1);";

		$bool = $stmt = $con->prepare($sql);

		$stmt->bind_param("sssi",
							$lobby['title'],
							$lobby['path'],
							$lobby['password'],
							$lobby['max_size']
		);

		$stmt->execute();
		$stmt->close();

		return $bool;

	}

	public function ConnectToLobby($title, $password){

	}


}

?>