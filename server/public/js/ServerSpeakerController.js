class ServerSpeakerController{

	constructor(){
		this.speaker = new ServerSpeaker();
	}

	setName(name)
	{
		this.send("set_name", name);
	}

	sendClientKey(key)
	{
		this.send("key", this.key)
	}
	start()
	{
	    this.speaker.openSocket();
	}

	send(action, data)
	{
		let key = this.key;
		if (key != undefined && key != "0")
		{
			this.sendWithKey(action, data);
		}
		else
		{
			this.sendWithoutKey(action, data);
		}
	}

	sendWithKey(action ,msg)
	{
		this.speaker.send({action, key: this.key ,data: msg})
	}
	sendWithoutKey(action ,msg)
	{
		this.speaker.send({action, data: msg})
	}

	get key()
	{
		return Cookie.get('key') ?? "0";
	}
}