<?


class Controller{

  // function Switch($route){



  // }

  function ToPage($route){

    if (strcmp($route, "game/index.php")) {
      // $lobbies = $db->getLobbies();
    }

    require_once ROOT.'/view/'.$route;

  }

  function Failure(){
    // echo "WARNING WARNING!!!";
      require_once ROOT.'/lib/FailurePage.php';
  }

  function GetLobbyList(){
  	return $GLOBALS['db']->getLobbies();
  }

  function CreateLobby($title, $path, $password, $max_size){
  	if ($GLOBALS['db']->addLobby( ['title' => $title, 'path' => $path, 'password' => $password, 'max_size' => $max_size] ) === 1){
  		return "succeed";
  	}
  	else{
  		return "failure";
  	}

  }

}
?>