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
			"get_lobbies" : "viewLobbies"
		};
	}

	initSpeker()
	{
		
		this.speaker = new ServerSpeaker();
	    
	    this.speaker.onopen = (event) => {
	        this.view_model.hideLoader();
	    };  

	    this.speaker.onmessage = (event) => {
	        console.log(event.data);
	        this.getServerMessage(event.data);
	    };

	    this.speaker.onerror = (event) =>
	    {
	        console.log("error");
	        console.log(event.msg);
	    }

	    this.speaker.onclose = (event) =>
	    {
	        this.view_model.viewLoader();
	        this.speaker.openSocket();
	    }

	    this.speaker.openSocket();
	}

	XMLRequest(path, message){ 

	 	return new Promise((resolve, reject) => {

	      	var xhr = new XMLHttpRequest();
	                                                    
	     	xhr.open('POST', path, true);

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
	};

	getServerMessage(message)
	{
		console.log(this);

		let ans = JSON.parse(message);
		this[this.routes[ans.action]](ans);


	}
	refreshLobbies()
	{
		//console.log(this);

		this.speaker.getLobbies();
	}

	viewLobbies(json)
	{
		let arr = json.data;
		
		this.view_model.viewLobbies(arr);

	}



}