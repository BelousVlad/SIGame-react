<?php

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
        $uri = $this->getURI();

        foreach($this->routes as $pattern => $route){

          if (preg_match("~$pattern~i", $uri) == 1 ){

              //$internal_route = preg_replace("~$pattern~i", $route, $uri);
              //echo $internal_route;
              //return $internal_route;
              (new Controller)->ToPage($route);


          }

        }


      }



}

class Controller{

  function ToPage($route){
      header('Location: /lib/'.$route.'/');
  }

}






 ?>
