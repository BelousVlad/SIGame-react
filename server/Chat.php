<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require "Answerer.php";
require "Client.php";

/*
    Chat have collection of connections 
    Any connection has Client 
    Any Client has Asnwerer

    Answerer can refer to his Client
    Client car refer to his Connection

    Connection <=> Client <=> Answerer
*/

class Chat implements MessageComponentInterface {
    protected $connections;
    protected $server;

    public function __construct($gameServer) {
        $this->connections = new \SplObjectStorage;
        $this->server = $gameServer;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $client = new Client($conn, $this->server);
        $conn->client = $client;


        $this->connections->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {

        //echo "\n-----\n$msg\n------\n";

        //var_dump($this->connections);
        /*
        echo "$msg";

        $test = json_decode($msg,true);

        echo $test;

        if ($test['action'] == "test") {
            echo "YES";

            file_put_contents("test.mp4", base64_decode($test["test"]));

        }

        */

        $from->client->answerer->answer($msg);
        

        /*
        echo "\n---------------------\n";
        echo "flag - $this->flag\n";
        if ($this->flag == 1) {

            echo "\n!file!!!\n";

            $streem = fopen("test.mp4", 'wb');

            echo fwrite($streem, $msg);

            echo " sended";

            fclose($streem);

            $this->flag = 0;

        }

        //echo "\n$msg - file\n";

        if ("file" == $msg)
        {
            echo "ok\n";
            $this->flag = 1;
        }

        echo "flag - ".$this->flag."\n";

        echo "\n---------------------\n";
        */



    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->connection->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}

?>