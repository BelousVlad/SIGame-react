<?php

// echo 123123213;

require_once('config.php');

require_once(ROOT.'/lib/DataBase.php');

$db = new DataBase();

// echo 0 == $GLOBALS['db']->addLobby(['title' => 'title', 'path' => 'path', 'password' => 'password', 'max_size' => 'max_size']);

// print_r ($GLOBALS['db']->getLobbies());
require_once(ROOT.'/lib/Controller.php');

require_once(ROOT.'/lib/Router.php');

$rout = new Router();
$rout->run();

// echo preg_match("~connection/\d+~", 'connection/123');

// $GLOBALS['db']->CreateFile(ROOT."/database/packs/test1", "someContent");
//
//
// $file = fopen(ROOT."/database/packs/test2.jpg",'w');
// fclose($file);


//require_once(ROOT.'/lib/routes.php');

// $rot = new Router(ROOT.'/lib/routes.php');



/*
ob_end_clean();
header("Connection: close\r\n");
header("Content-Encoding: none\r\n");
ignore_user_abort( true ); // optional
ob_start();
echo ('Text user will see');
$size = ob_get_length();
header("Content-Length: $size");
ob_end_flush();
flush();
ob_end_clean();

echo "not see";
*/

?>

