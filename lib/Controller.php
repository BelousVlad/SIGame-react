class Controller{

  // function Switch($route){



  // }

  function ToPage($route){



      require_once ROOT.'/view/'.$route.'/index.php';

  }

  function Failure(){
    // echo "WARNING WARNING!!!";
      require_once ROOT.'/lib/FailurePage.php';
  }

}