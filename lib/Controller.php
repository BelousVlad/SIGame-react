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
  	return $_GLOBAL['db']->getLobbies();
  }

  function CreateLobby(){

  }

}
?>