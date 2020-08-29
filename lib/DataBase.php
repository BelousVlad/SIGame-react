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

	public function getLobbies()
	{
		$con = self::getConnection();

		$sql = "SELECT * FROM lobbies";

		$result = $con->query($sql);

		return $result->fetch_assoc();
	}

	public function addLobby($lobby)
	{
		$con = self::getConnection();

		$sql = "INSERT INTO `lobbies` (`title`, `path`, `password`, `max_size`, `current_round`) VALUES (?, ?, ?, ?, ?);";

		$stmt = $con->prepare($sql);

		$stmt->bind_param("sssii",
							$lobby['title'],
							$lobby['path'],
							$lobby['password'],
							$lobby['max_size'],
							$lobby['current_round']
		);

		$stmt->execute();
		$stmt->close();
	}


}

?>