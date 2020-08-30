<?php

return array(
'^$' => 'index.php',
'^game$' => 'game/index.php' ,
"^record$" => 'records/index.php',
 '^(game/create)$' => 'game/create.php',
 'connection/\d+' => 'connection/connect.php'
 //,
// '^(lobby/)([0-9])+' => 'thisgame1/index.php',
// 'js/main.js' => 'js'
);


?>
