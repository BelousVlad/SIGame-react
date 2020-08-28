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

          if ($uri == ""){
            (new Controller)->ToPage("");
                        }


      if (preg_match("~$pattern~i", $uri) == 1 ){

            if ( count( explode('/', $route) ) == 1 ){

            (new Controller)->ToPage($route);
            return;
}
    else{

            return;
            }

                        // if ($uri == ""){
                        //     (new Controller)->ToPage("../view");
                        //     return;

          }
        (new Controller)->Failure();
        return;

    }



}

class Controller{

  // function Switch($route){



  // }

  function ToPage($route){



      require_once ROOT.'/view/'.$route.'/index.php';

  }

  function Failure(){
      require_once ROOT.'/lib/FailurePage.php';
  }

}






 ?>
