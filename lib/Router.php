<?php



require_once('W:\domains\test123.com\\config.php');

include ROOT.'/lib/Controller.php';

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


       if ( count( explode('/', $uri) ) == 1 ){

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

  function getURI(){
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
          // print_r($_POST['GetLobbyList']);
          // echo 12312312321321;

          if ( empty($_POST) ){
            $this->DeterminePage();
            return;
          }
          else if ( $_POST['CreateLobby'] == 1){
            (new Controller)->CreateLobby();
            return;
          }
          else if ($_POST['GetLobbyList'] == 1){
            echo (new Controller)->GetLobbyList();
            return;
          }

          throw new Exception("no such query allowerd");


          // if ($uri == ""){
          //   (new Controller)->ToPage("");
          //   return;
          //               }



                        // if ($uri == ""){
                        //     (new Controller)->ToPage("../view");
                        //     return;




    }



}


$rout = new Router();
$rout->run();


 ?>
