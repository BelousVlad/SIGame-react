class App{

	constructor()
	{
		this.initEventModel(); // adds event model
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

// -------------------------------

	initEventModel () {
		var __Event = /* class */ ( function ( ) {
			var __index = 0;
			function __Event ( e_name, func, options ) {
				const default_options = {
					once : false,
				};

				options = typeof options === 'object' ? options : new Object();
				for ( let i in default_options )
					options[i] = typeof options[i] !== 'undefined' ? options[i] : default_options;

				this.name = e_name;
				this.method = func;
				this.id = __index;
				__index++;
				this.dispatch = function ( ...args ) {
					this.method( ...args );
					if ( options.once === true )
						this.die();
				}

				this.die = function() {}; // behavior implements from source . example of source is subscribe method.
			}

			return __Event;
		} () );

		this.__events = new Array();
		this.__events.forEachRight = function( func ) {
			this.reduceRight( ( _, item ) => { func( item ); }, undefined );
		}

		this.subscribe = ( function ( e_name, func, options ) {
			var event = new __Event( e_name, func, options );

			var __die = ( function () {
				this.__events.splice( this.__events.indexOf( event ), 1 );
			} ).bind(this)

			event.die = __die;
			this.__events.push( event );

			return event.id;

		} ).bind(this);

		this.subscribe_once = ( function ( e_name, func, options ) {
			options = typeof options === 'object' ? options : new Object();

			return this.subscribe( e_name, func, Object.assign( options, {once : true} ) );

		} ).bind(this)

		this.dispatch = ( function ( e_name, ...__args ) {
			this.__events.forEachRight( item => {
				if ( item.name === e_name )
					item.dispatch( ...__args );
			} )
		} ).bind(this)

		this.clear = ( function ( e_name ) {
			this__events.forEachRight( item => {
				if ( item.name === e_name )
					item.die();
			});
		} ).bind(this)

		this.delete = ( function ( e_name, func, __toString = false ) {
			var events = this.__events.filter( item => item.name === e_name );

			if ( !__toString ) {
				events.forEachRight( item => {
					if ( item.method === func )
						item.die()
				} )
			} else if ( __toString ) {
				events.forEachRight( item => {
					if ( item.method.toString() === func.toString() )
						item.die()
				} )
			}
		} ).bind(this)

		this.deleteById = ( function ( id ) {
			this.__events.find( item => item.id == id ).die();
		} ).bind(this)
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
	showRound( msg ) {
		this.view_model.showRound( msg.data );
	}
	updateName(msg)
	{
		console.log(msg)
		//this.GOTOPage();
	}

	nameSetSucced(msg) { // calls when
		this.GOTOPage();
		let name = msg.data.name;
		updateName( msg );
	}

	nameSetFailed(msg) {
		//
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
		let title = msg.data.title;
		let max_players = msg.data.max_players;
		let is_host = msg.data.is_host;
		this.lobby = new Lobby(title, max_players, is_host);
		if (document.location.pathname != '/lobby')
		{
			this.pager.changePage('/lobby')
			.then(() => {
				//console.log('page_updated')
				app.view_model.viewPlayers(this.lobby.players_, is_host)
			});
		}
	}

	updateStatus(msg)
	{
		if (msg.data != 0)
		{
			console.log(msg)
			if (msg.data.name)
				this.updateName(msg)
			if (msg.data.lobby)
			{
				let lobby = msg.data.lobby;
				this.lobby_connected({ data:
						{ title: lobby.title, max_players: lobby.max_players, is_host: lobby.is_host } }
				)
			}
		}
	}

	lobby_list(json)
	{
		let arr = json.data;

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

	updateLobbyPlayers(msg)
	{
		let players = msg.data.players;
		if (players && this.lobby)
		{
			this.lobby.players = players
		}
	}

	addLobbyPlayer(msg)
	{
		let player = msg.data.player;
		if (player && this.lobby)
		{
			this.lobby.addPlayer(player);
		}
	}

	kick_player(name)
	{
		if (this.lobby && this.lobby.is_host)
		{
            app.speakerctrl.kick_player(name);
		}
	}

	kicked_from_lobby(msg)
	{
		this.lobby = undefined;
		this.pager.changePage('/')
	}

	lobbyChatGetMessage(msg)
	{
		let message = msg.data;
		this.view_model.addChatMessage(message)
	}

	lobbyRemovePlayer(msg)
	{
		let player_name = msg.data.player.name;

		if (this.lobby)
			this.lobby.removePlayerByName(player_name);

	}

	lobbyChangedPlayerScore(msg)
	{
		let player_name = msg.data.player_name;
		let score = msg.data.score;

		if (this.lobby)
		{
			let player = this.lobby.getPlayerByName(player_name)

			this.lobby.changeScore(player, score);
		}
	}

	lobbyChangePlayerScore(player_name, score)
	{
		console.log(player_name)
		console.log(score)
		if(player_name)
		{
			this.speakerctrl.setScorePlayer(player_name, score)
		}
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
		this.pager.changePage.call( this.pager,  path );
	}

	displayError( msg ) {
		if ( !( msg && msg.data && msg.data.text ) )
		this.view.displayError( msg.data.text );
	}

	awaitClientKey(  ) { // возможно не потребуется
		return new Promise( ( ( resolve, reject ) => {
			this.subscribe_once( 'client_key_succeed', ( key ) => {
				resolve( key );
			} )
		} ).bind(this) )
	}

	clientKeySucceed( msg ) {
		let key = msg.data.key;
		this.dispatch( 'client_key_succeed', key);
	}

//  -------------------
	//  END of Actions block
//  -------------------

}