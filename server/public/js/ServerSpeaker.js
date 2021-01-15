
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
		this.socket = new WebSocket('ws://localhost:3001');
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


// XMLHttpsRequest
//-------------

	XMLRequest(path, message){

	 	return new Promise((resolve, reject) => {

	      	var xhr = new XMLHttpRequest();

	     	xhr.open('POST', path /* ???? */, true);

		  	xhr.onload = function(){

				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(xhr.response);
				}
				else {
					reject(xhr.statusText);
				}

		  	};

	      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	      xhr.send( message );

	  })
	}
// -------

}