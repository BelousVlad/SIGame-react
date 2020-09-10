class App{

	constructor()
	{
		this.socket = this.openSocket();

		this.clickEventer = new Eventer();
		this.pager = new Pager(this.XMLRequest);
		this.view_model = new ViewModel();


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

	openSocket()
	{
		let socket;

	    let socket1 = new WebSocket('ws://sigame:8640');

	    socket1.binaryType = "arraybuffer";

	    socket1.onopen = (event) => {
	        this.view_model.hideLoader();
	    };  

	    socket1.addEventListener('message', (event) => {
	        console.log('Message from server ', event.data);
	    });

	    socket1.onerror = (event) =>
	    {
	        console.log("error");
	        console.log(event.msg);
	    }

	    socket1.onclose = (event) =>
	    {
	        this.view_model.viewLoader();
	        socket = this.openSocket();
	    }

	    return socket1;
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





}