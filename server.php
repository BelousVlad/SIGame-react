<?php
ini_set('memory_limit', '1024M');
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require 'vendor/autoload.php';
require 'server/GameServer.php';
require 'server/Player.php';
require 'server/Lobby.php';
require 'server/Chat.php';



$gameServer = new GameServer();
$chat = new Chat($gameServer);

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            $chat
        )
    ),
    8640
);

$server->run();

?>