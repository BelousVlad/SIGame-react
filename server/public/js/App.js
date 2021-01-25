class App{

	constructor()
	{

		this.view_model = new ViewModel();
		this.view_model.hideLoader();
		this.initSpeker();
		this.router = new Router();

		this.lobby = undefined;

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





//  -------------------
	// Actions (routes)
//  -------------------


	ping(json)
	{
		console.log(json);
	}
	updateName(msg)
	{
		this.GOTOPage();
	}
	setKey (data) { // Установить уникальный ключь
		Cookie.set("key", data.data);
	}
	lobby_created(msg)
	{
		console.log(msg)
	}
	lobby_connected(msg)
	{
		console.log(msg)
		this.pager.changePage('/lobby');
		let title = msg.data.title;
		let max_players = msg.data.max_players;
		this.lobby = new Lobby(title, max_players);
	}

	updateStatus(msg)
	{
		if (msg.data != 0)
		{
			console.log(msg)
			if (msg.data.name)
				this.updateName(msg)
			if (msg.data.lobby) //403 - NO_SUCH_LOBBY
			{
				let lobby = msg.data.lobby;
				this.lobby_connected({ data:
						{ title: lobby.title, max_players: lobby.max_players }}
				)
			}
		}
	}

	lobby_list(json)
	{
		let arr = json.data;

		console.log(json)

		this.view_model.viewLobbies(arr, function(e){
			let is_password = $(this).attr('is_password')
			let title = $(this).attr('title')
	        if(is_password)
	        {
	            app.view_model.viewPasswordPopup()
	            .then((data) => {
	                let password = data.password;
	                let element = data.element;



	                app.speakerctrl.connectToLobby(title, password);

	            })
	            .catch(() => {

	            })
	        }
		});

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