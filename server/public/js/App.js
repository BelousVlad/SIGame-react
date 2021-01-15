class App{

	constructor()
	{

		//this.cookie = new Cookie();
		//this.fileLoader = new FileLoader( this );
		// this.fileLoader.createLoadManager().bindToElement(  );

		// this.Cookie.setCookie('','');

		this.view_model = new ViewModel();
		this.view_model.hideLoader();
		this.initRoutes();
		this.initSpeker();


		/*this.speakerctrl.ping("test2");this.initMetaData();*/
		// };
		// this.initEventListeners();
		


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


	initRoutes()
	{
		this.routes = {
			"ping" : "ping",
			"set_key" : "setKey",
			////////////////
			"call_actions_array" : "callActionsArray",
			"client_code_checked" : "clientCodeSucceed",
			"set_client_code" : "setClientCode",
			"get_lobbies" : "viewLobbies",
			"connect_to_lobby" : "lobbyConnect",
			"set_secret_code" : "setSecretCode",
			"view_clients" : "viewClients",
			"view_broadcast" : "viewBroadcast",
			"send_current_file" : "",
			"task_to_certain_lm" : "handleTaskToLoadManager",
			"resolve_meta_data" : "resolveMetaData",
			"name_is_valid" : "nameIsValid",
			"name_is_not_valid" : "nameIsNotValid",
			"go_to_page" : "GOTOPage"
		};
	}

	ping(json)
	{
		console.log(json);
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
	        this.getServerMessage(event.data);
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

	initMetaData(){
		// this.speakerctrl.ping("test1");
		let clientCode = window.localStorage.getItem('client_code') || "empty?"; // TODO find name to empty field

		let data = {
			client_code : clientCode
			// lm_list : lmList
		}
		this.speakerctrl.initMetaData( data );
	}

	resolveMetaData( msg ){

		this.view_model.hideLoader();
	}



	getServerMessage(message)
	{
		//console.log(message);

		let ans = JSON.parse(message);
		this[this.routes[ans.action]](ans);


	}

	callActionsArray(message){
		// this.speacialfield = message.data.actionList;
		let actionList = message.data.actionList;
		for ( const field in actionList ){
			this[ this.routes[ actionList[field].action ] ]( actionList[field] );
		}
	}
//
//  ---------------- ** ----
//

	getClients(){
		this.speakerctrl.getClients();
	}

	setClientName( name ) {
		this.speakerctrl.setClientName( name );
	}



//  -------------------
	// Actions (routes)
//  -------------------

	viewLobbies(json)
	{
		let arr = json.data;

		this.view_model.viewLobbies(arr);

	}




	refreshLobbies()
	{
		//console.log(this);

		this.speakerctrl.getLobbies();
	}



	lobbyConnect(json){

		this.speakerctrl.lobbyConnect(json);

	}

	setKey (data) { // Установить уникальный ключь
		console.log(data);
		Cookie.set("key", data.data);
		//this.speakerctrl.key = 
	}

	fastInit(){
		this.speakerctrl.fastInit();
	}


	viewClients( json ){
		let data = json.data;
		console.log( json );
	}


	setClientCode( json ) {
		// console.log(1);
		let data = json.data;
		window.localStorage.setItem( "client_code", data);
		// this.clientCodeSucceed();
	}

	clientCodeSucceed(){
		this.view_model.hideLoader();
	}


	viewBroadcast ( msg ) {
		let data = msg.data;
		console.log ( "\n \n --- \n ");
		console.log(data);
		console.log ( "\n --- \n \n ");
	}

	handleTaskToLoadManager( msg ) {
		//this.fileLoader.getLoadManagerById( msg.data.load_manager_id )
		//[ this.fileLoader.routes [ msg.data.action_of_lm ] ] ( msg.data.answer ) ;
	}

	nameIsValid( msg ){
		this.view_model.hideLoader();
	}

	nameIsNotValid( msg ){
		// this.view_model.viewLoader();
	}

	setClientName( name ){
		window.localStorage.setItem('clientName', name);
		this.speakerctrl.checkClientName( window.localStorage.getItem('clientName') );
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