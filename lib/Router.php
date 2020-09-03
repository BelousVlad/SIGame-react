<?php



// require_once(ROOT.'\config.php');


// include ROOT.'/lib/Controller.php';
class Router{


    private $routes;

    function __construct(){

    $this->SetRoutes(ROOT.'/lib/routes.php');

    // $this->routes = include($rtp);
    }

    function SetRoutes($rtp){
        $this->routes = include($rtp);
    }

    function DeterminePage(){

        $uri = $this->getURI();

        foreach ( $this->routes as $pattern=>$route){

        if (preg_match("~$pattern~i", $uri) == 1 ){


        if (( count( explode('/', $uri) ) == 1 ) || (( count( explode('/', $uri) ) == 2 ) && ( explode('/', $uri)[0] == "game" ) && (explode('/', $uri)[1] == "create") )){

            (new Controller)->ToPage($route);
            return;
        }

        if (( count( explode('/', $uri) ) == 1 ) || (( count( explode('/', $uri) ) == 2 ) && ( explode('/', $uri)[0] == "connection" ) && ( preg_match( "~^(\d+)$~", explode('/', $uri)[1] ) == 1) )) {

          (new Controller)->ToPage($route);
          return;
        }

        else if (( count( explode('/', $uri) ) == 2 ) && (explode('/', $uri)[0] == "lobby") && ( preg_match("~[0-9]~",explode('/', $uri)[1]) )) {

          $roomID = (explode('/', $uri))[1];
          require_once(ROOT.'/view/lobby/index.php');
          return;

        }
      }
    }

            (new Controller)->Failure();
            return;
      }

      public static function getURI()
      {
        if(!empty($_SERVER['REQUEST_URI'])) {
            return trim($_SERVER['REQUEST_URI'], '/');
        }

        if(!empty($_SERVER['PATH_INFO'])) {
            return trim($_SERVER['PATH_INFO'], '/');
        }

        if(!empty($_SERVER['QUERY_STRING'])) {
            return trim($_SERVER['QUERY_STRING'], '/');
        }
      }

        function run(){

            $uri = self::getURI();

            foreach ($this->routes as $pattern => $address) {
               if (preg_match("~$pattern~", $uri,$matches)) {

                    $iternal = preg_replace("~$pattern~", $address, $uri);

                    $exp = explode('/', $iternal);

                    $contName = array_shift($exp)."Controller";
                    $actionName = "action".ucfirst(array_shift($exp));

                    include_once (ROOT."/lib/controllers/".$contName.".php");

                    $controller = new $contName;

                    call_user_func_array(array($controller,$actionName), $exp);
               }
            }

            /*
          if ( $_POST['CreateLobby'] == 1){
            (new Controller)->CreateLobby( $_POST['title'], $_POST['path'], $_POST['passwrod'], $_POST['max_size'] );
            return;
          }
          else if ($_POST['GetLobbyList'] == 1){

            $lobs = $GLOBALS['db']->getLobbies();

            echo json_encode($lobs);

            return;
          }
          else if ($_POST['ConnectToLobby'] == 1){
            (new Controller)->ConnectToLobby( $_POST['title'], $_POST['password'] );
            return;
          }

          throw new Exception("no such query in POST allowerd");
        */

          // if ($uri == ""){
          //   (new Controller)->ToPage("");
          //   return;
          //               }



                        // if ($uri == ""){
                        //     (new Controller)->ToPage("../view");
                        //     return;
    }
}


 ?>
