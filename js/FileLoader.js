class LoadManager{
	constructor( fileLoader, type ){


		this.type = type; // now just 2 must exist : question-pack , avatar-image;
		this.fileLoader = fileLoader;
		this.id = fileLoader.lastId;
		fileLoader.lastId++;
		this.fileReader = new FileReader();
	}

	sendRequestToUploadFile(){
		this.fileLoader.app.speakerctrl.sendRequestToUploadFile( { details : { size : this.currentFile.size, type : this.type, load_manager_id : this.id } } );
	}

	sendFilePart(){
		;
	}

	sendFile(){
		// alert(1);
		let send = () => { this.fileLoader.app.speakerctrl.sendFile( { file : this.fileReader.result, details : { size : this.currentFile.size, type : this.type, load_manager_id : this.id } } ) }
		if ( this.fileReader.readyState < 2 ){
			this.fileReader.onload = ( e ) => { send() };
		} else {
			send();
		}
	}

	bindToElement( elem ){
		elem.onclick = () => {
			let input = document.createElement("input");
			input.type = "file";
			input.onchange = ( e ) => {
				this.currentFile = input.files[0];
				this.sendRequestToUploadFile();
				this.fileReader.readAsDataURL( input.files[0] );
			} ;
			input.click();

		};
	}

	getId(){
		return this.id;
	}


}


class FileLoader{ // TODO maybe FILE Loader Answerer in APP object wich will определять когда пришли ответы на запросы определенных лоад менеджеров чтобы они смогли получить свои ответы и не только.

	// const max_size = 3 * 1000;

	constructor(app){

		// this.dragNDropInit();
		this.initRoutes();

		this.app = app;
		this.lastId = 0;

		this.loadManagerList = [];

	}

	createLoadManager( type ){
		let lManager = new LoadManager( this, type );
		this.loadManagerList.push( lManager );
		return lManager;
	}

	getLoadManagerById (id) {
		return this.loadManagerList[id];
	}

	initRoutes(){
		this.routes = {
			"start_uploading_file" : "sendFile"
		};
	}



	// sendFileInfo( additionalData ){
	// 	app.socketctrl.sendFileInfo( { size : this.currentFile.size, additional_data : additionalData } );
	// }

	// dragNDropInit(){ // TODO make it's option to Load Manager object
	// 	return;
	// }

	// getProgress(){
		// return;
	// }



}