<?php

require 'config.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require ROOT.'/vendor/autoload.php';
require ROOT.'/server/GameServer.php';
require ROOT.'/server/Lobby.php';
require ROOT.'/server/Chat.php';


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