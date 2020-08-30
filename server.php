<?

$socket = socket_create(AF_INET, SOCK_STREAM, 0);
$res = socket_bind($socket, "localhost", 1488);

$res = socket_listen($socket);

echo "Listen";

do {
	$accept = socket_accept($socket);
	$msg = socket_read($socket, 2048);

	echo $msg;

} while(true);

socket_close($socket);

?>