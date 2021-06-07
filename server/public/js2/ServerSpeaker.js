class ServerSpeaker {
	constructor(router)
	{
		this.socket;
		this.onerror;
		this.onclose;
		this.onopen;

		this.router = router;
	}

	openSocket()
	{
		this.socket = new WebSocket('ws://10.11.0.235:3001');
	    this.socket.binaryType = "arraybuffer";
	    this.socket.onopen = this.onopen;
	    this.socket.onmessage = this.onmessage.bind(this);
	    this.socket.onerror = this.onerror;
	    this.socket.onclose = this.onclose;
	}

	onmessage(msg)
	{
		let message = JSON.parse(msg.data);
		this.router.getServerMessage(message);
	}

	isOpen()
	{
		return this.socket.readyState === WebSocket.OPEN;
	}

	send(action)
	{
        if (this.isOpen())
        {
            this.socket.send(JSON.stringify(action));
			return true;
		}
		else
			return false;
	}
}