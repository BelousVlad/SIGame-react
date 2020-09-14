
class ServerSpeaker {
	constructor()
	{
		this.socket;
		this.onerror;
		this.onclose;
		this.onopen;
		this.onmessage;
	}

	openSocket()
	{
		this.socket = new WebSocket('ws://sigame:8640');
	    this.socket.binaryType = "arraybuffer";
	    this.socket.onopen = this.onopen;
	    this.socket.onmessage = this.onmessage;
	    this.socket.onerror = this.onerror;
	    this.socket.onclose = this.onclose;
	}

	isOpen()
	{
		return this.socket.readyState == WebSocket.OPEN;
	}

	getLobbies()
	{
		this.send({ action: "get_lobbies" });
	}

	send(action)
	{
		if (this.isOpen()) 
		{
			this.socket.send(JSON.stringify(action));
		}
	}






}