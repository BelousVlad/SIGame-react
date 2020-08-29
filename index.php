<?php


require_once('config.php');

require_once(ROOT.'/lib/Router.php');
require_once(ROOT.'/lib/DataBase.php');
//require_once(ROOT.'/lib/routes.php');

$rot = new Router(ROOT.'/lib/routes.php');


$db = new DataBase();

var_dump($db->getLobbies());

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

