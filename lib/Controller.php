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
  	print_r( $GLOBALS['db']->getLobbies() );
  }

  function CreateLobby($title, $path, $password, $max_size){
    // echo 1;
    echo $path;
    $GLOBALS['db']->CreateFile($title, $path);
  	if ($GLOBALS['db']->addLobby( ['title' => $title, 'path' => ROOT.'/database/packs/$title.jpg', 'password' => $password, 'max_size' => $max_size] ) === 1){
  		echo "succeed";
  	}
  	else{
  		echo "failure";
  	}

  }

  function ConnectToLobby($title,$password){
  	$GLOBALS['db']->ConnectToLobby($title,$password);
  	return;
  }

}
?>