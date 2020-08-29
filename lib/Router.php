<?php

include ROOT.'/lib/Controller.php';

class Router{

  private $routes;

  function __construct($rtp){
    $this->routes = include($rtp);

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

          // echo 12312312321321;

          $uri = $this->getURI();

          if ($uri == ""){
            (new Controller)->ToPage("");
            return;
                        }

                        foreach ( $this->routes as $pattern=>$route){
// echo "misssssssssssssssssssssssssstake";
      if (preg_match("~$pattern~i", $uri) == 1 ){

            if ( count( explode('/', $route) ) == 1 ){
// (new Controller)->Failure();
            (new Controller)->ToPage($route);
            return;
            }
            else if (( count( explode('/', $route) ) == 2 ) && (explode('/', $route)[0] == "lobby") && ( preg_match("~[0-9]~",explode('/', $route)[1]) )) {
              $roomID = (explode('/', $route))[1];
              require_once(ROOT.'/view/lobby/index.php');
              return;
            }


                        // if ($uri == ""){
            }            //     (new Controller)->ToPage("../view");
                        //     return;

          }
        (new Controller)->Failure();
        return;

    }



}








 ?>
