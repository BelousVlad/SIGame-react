class App{

	constructor()
	{


		this.fileLoader = new FileLoader( this );
		// this.fileLoader.createLoadManager().bindToElement(  );

		this.view_model = new ViewModel();
		this.initSpeker();
		this.initRoutes();

		/*this.speakerctrl.ping("test2");this.initMetaData();*/
		// };
		// this.initEventListeners();



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

	dummy(){};

//
// 	SecretCodeBlock (don't work)
//
	// async getSecretCode(){ // RETURN PROMISE

	// 	if ( window.localStorage.getItem( 'sercretCode' ) == null ){
	// 		let val = await this.makeSecretCode.call(this)

	// 		window.localStorage.setItem ( 'secretCode', val);
	// 	}
	// 	return window.localStorage.getItem( 'secretCode' );

	// }

	// async setSecretCode( json ){

	// 	let code = json.data;
	// 	window.localStorage.setItem( 'secretCode', code );
	// 	window.dispatchEvent( new CustomEvent( 'secretCodeReceived', { detail : { data : code } } ) );    // WARNING X WARNING X WARNING. CustomEvent object don't deleted in future and keep storing after func (maybe)

	// }

	// async makeSecretCode(){

	// 	let prom = new Promise( (resolve, reject) => { window.addEventListener( 'secretCodeReceived',  (e) => { resolve( e.detail.data )} ) } /* */ );
	// 	this.speakerctrl.makeSecretCode();
	// 	return await prom;

	// }

//
//  end ---
//


	// initEventListeners(){
	// 	window.addEventListener( "client_code_succeed", ()=>{} );
	// }

	initRoutes()
	{
		this.routes = {
			"dummy" : "dummy",
			"call_actions_array" : "callActionsArray",
			"client_code_checked" : "clientCodeSucceed",
			"set_client_code" : "setClientCode",
			"get_lobbies" : "viewLobbies",
			"connect_to_lobby" : "lobbyConnect",
			"setPlayerUniqueKey" : "setPlayerKey",
			"set_secret_code" : "setSecretCode",
			"view_clients" : "viewClients",
			"view_broadcast" : "viewBroadcast",
			"send_current_file" : "",
			"task_to_certain_lm" : "handleTaskToLoadManager",
			"resolve_meta_data" : "resolveMetaData"
		};
	}

	initSpeker()
	{

		this.speakerctrl = new ServerSpeakerController();

	    this.speakerctrl.speaker.onopen = (event) => {
	    	this.view_model.hideLoader();
	    	this.initMetaData();
	    };

	    this.speakerctrl.speaker.onmessage = (event) => {
	        // console.log(event.data);
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
		// console.log(message);


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

	setPlayerKey (json) {

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
		this.fileLoader.getLoadManagerById( msg.data.load_manager_id )
		[ this.fileLoader.routes [ msg.data.action_of_lm ] ] ( msg.data.answer ) ;
	}

//  -------------------
	//  END of Actions block
//  -------------------

}