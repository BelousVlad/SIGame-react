class App{

	constructor()
	{
		this.view = new ViewModel();
		this.ServerResponseManager = new ServerResponseManager(this);
		this.Router = new Router(this.ServerResponseManager);
		this.ServerSpeaker = new ServerSpeaker(this.Router);
		this.ServerCommandManager = new ServerCommandManager(this.ServerSpeaker);

		this.ServerSpeaker.onopen = () => {
			this.ServerCommandManager.sendKey();
		}

		this.ServerSpeaker.openSocket();
	}

	get lobby() { return this._lobby }
	set lobby(data) { this._lobby = new Lobby(data.info, data.players, data.position, this.view) }
}