class App{

	constructor()
	{

		this.view_model = new ViewModel();
		this.view_model.hideLoader();
		this.initSpeker();
		this.router = new Router();

		this.clickEventer = new Eventer();
		this.pager = new Pager(this);

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


	initSpeker()
	{

		this.speakerctrl = new ServerSpeakerController();

	    this.speakerctrl.speaker.onopen = (event) => {
	    	console.log("connected");

			this.speakerctrl.sendClientKey();

	    	if ( window.localStorage.getItem('clientName') ){
	    		this.speakerctrl.checkClientName( window.localStorage.getItem('clientName') );
	    	} else {
	    		// TODO this.view_model.getNameInput()l
	    	}
	    	// this.view_model.hideLoader();
	    	// this.initMetaData();
	    };

	    this.speakerctrl.speaker.onmessage = (event) => {
	    	//console.log(123);
	        //console.log(event.data);
	        this.router.getServerMessage(event.data);
	    };

	    this.speakerctrl.speaker.onerror = (event) =>
	    {
	        console.log("error");
	        console.log(event.msg);
	    }

	    this.speakerctrl.speaker.onclose = (event) =>
	    {
	        // this.view_model.viewLoader();
	        this.speakerctrl.start();
	    }
	    this.speakerctrl.start();

	}

	
//
//  ---------------- ** ----
//

	getClients(){
		this.speakerctrl.getClients();
	}


	viewLobbies(json)
	{
		let arr = json.data;

		this.view_model.viewLobbies(arr);

	}


//  -------------------
	// Actions (routes)
//  -------------------


	ping(json)
	{
		console.log(json);
	}
	updateName(msg)
	{
		console.log(msg);	
	}
	setKey (data) { // Установить уникальный ключь
		Cookie.set("key", data.data);
	}
	lobby_created(msg)
	{
		//TODO LOBBY CONNECTED
		console.log(msg)
	}
	lobby_connected(msg)
	{
		//TODO LOBBY CONNECTED
		console.log(msg)
	}

	handleTaskToLoadManager( msg ) {
		//this.fileLoader.getLoadManagerById( msg.data.load_manager_id )
		//[ this.fileLoader.routes [ msg.data.action_of_lm ] ] ( msg.data.answer ) ;
	}

	GOTOPage ( msg ) {
		let path;
		if ( msg && msg.data && msg.data.path )
			path = msg.data.path;
		else{

			path = window.location.href;
			// path = path.split('/');
			// path = path.slice(3);
			// path = path.join('/');
			// console.log(path);
		}
		console.log(path);
		this.pager.changePage.call( this.pager,  path );
	}

//  -------------------
	//  END of Actions block
//  -------------------

}