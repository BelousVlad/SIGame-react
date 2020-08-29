<?
class DataBase{

	public static $connection;

	public static function getConnection()
	{
		if (is_null($connection)) {
			$connection = mysqli_connect("localhost","root","root","sigame")
		}
		return $connection; 
	}


}

?>