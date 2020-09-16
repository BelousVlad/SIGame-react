class App{

	constructor()
	{
		this.view_model = new ViewModel();
		this.initSpeker();
		this.initRoutes();

		this.clickEventer = new Eventer();
		this.pager = new Pager(this.XMLRequest);

		this.clickEventer.addEvent("a", (event) => {

			let link = $(event.target).attr("href").trim();

			this.pager.changePage(link);

			return false;
		})

		$(document).bind("click", (event) => {
			return this.clickEventer.checkAndRun(event.target,event);
		})

		window.onpopstate = (event) => {
		    this.pager.changePage(document.URL, false);
		}

	}

	initRoutes()
	{
		this.routes = {
			"get_lobbies" : "viewLobbies",
			"connect_to_lobby" : "lobbyConnect",
			"setPlayerUniqueKey" : "setPlayerKey"
		};
	}

	initSpeker()
	{

		this.speakerctrl = new ServerSpeakerController();

	    this.speakerctrl.speaker.onopen = (event) => {
	        this.view_model.hideLoader();
	    };

	    this.speakerctrl.speaker.onmessage = (event) => {
	        console.log(event.data);
	        this.getServerMessage(event.data);
	    };

	    this.speakerctrl.speaker.onerror = (event) =>
	    {
	        console.log("error");
	        console.log(event.msg);
	    }

	    this.speakerctrl.speaker.onclose = (event) =>
	    {
	        this.view_model.viewLoader();
	        this.speakerctrl.speaker.openSocket();
	    }

	    this.speakerctrl.speaker.openSocket();
	}



	getServerMessage(message)
	{
		console.log(this);

		let ans = JSON.parse(message);
		this[this.routes[ans.action]](ans);


	}

	viewLobbies(json)
	{
		let arr = json.data;

		this.view_model.viewLobbies(arr);

	}


//  -------------------
	// Actions (routes)
//  -------------------

	refreshLobbies()
	{
		//console.log(this);

		this.speakerctrl.getLobbies();
	}



	lobbyConnect(json){

		this.speakerctrl.lobbyConnect(json);

	}

	setPlayerKey (json) {

	}

//  -------------------
	//  END of Actions block
//  -------------------

}