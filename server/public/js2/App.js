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
}