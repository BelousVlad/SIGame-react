
<?php


define('ROOT', dirname(__FILE__) );

require_once(ROOT.'/lib/Router.php');
//require_once(ROOT.'/lib/routes.php');

$rot = new Router(ROOT.'/lib/routes.php');

$rot->run();





?>