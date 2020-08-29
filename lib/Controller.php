<?
class Controller{

  // function Switch($route){



  // }

  function ToPage($route){



      require_once ROOT.'/view/'.$route;

  }

  function Failure(){
    // echo "WARNING WARNING!!!";
      require_once ROOT.'/lib/FailurePage.php';
  }

  function GetLobbyList(){
  	return "maybe it's created, but i don't sure";
  }

  function CreateLobby(){

  }

}
?>