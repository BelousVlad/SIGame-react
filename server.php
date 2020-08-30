<?

$host = "sigame";
$port = "8640";

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
$res = socket_bind($socket, "0", $port);

$res = socket_listen($socket);

echo "Listen\n";

do {
	$accept = socket_accept($socket);

	echo "accepted\n"; 

	$msg = socket_read($accept, 2048);

	echo $msg;

	$temp = preg_split("~\r\n~", $msg);

	$headers = array();


	foreach ($temp as $line) {
		$line = rtrim($line);

		if (preg_match('~\A(\S+): (.*)\z~', $line, $matches)) {
			$headers[$matches[1]] = $matches[2];

		}
	}

	$key = $headers['Sec-WebSocket-Key'];

	$hash = $key.'258EAFA5-E914-47DA-95CA-C5AB0DC85B11'; 
	$hash = sha1($hash,true);
	$sKey = base64_encode($hash); 

	$headersResp = "	
		HTTP/1.1 101 Switching Protocols\n\r
		Upgrade: websocket\n\r
		Connection: Upgrade\n\r
		Sec-WebSocket-Accept: $sKey\n\r
		Access-Control-Allow-Origin: http://sigame\n\r
	";

	echo $headersResp;

	socket_write($accept, $headersResp);


} while(true);

socket_close($socket);

?>