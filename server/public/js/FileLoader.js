
class FileSender{
	constructor( name, type, id ){
		this.name = name;
		this.type = type;
		this.id = id;
		this.filesToLoad = [];
		//
	}

	bindClickElement( obj ){
		//
	}

	bindDropElement( obj ){
		//
	}




}

class LoadManager{
	constructor(){
		this.id = 0;
		this.fileSenders = [];
		//
	}

	createFileSender( name, type ){
		this.fileSenders.push( new FileSender( name, type, this.id ) );
		this.id++;
	}

	getFileSenderById( id ){
		return this.fileSenders[id] || (() =>{throw 'out of range';}).call();
	}
}




// class LoadManager{
// 	constructor( fileLoader, type ){

// 		this.max_size = 1000000;

// 		this.type = type; // now just 2 must exist : question-pack , avatar-image;
// 		this.fileLoader = fileLoader;


// 		this.id = fileLoader.lastId;
// 		fileLoader.lastId++;
// 		this.fileReader = new FileReader();

// 		this.fileReader.onload = ( e ) => { this.sendRequestToUploadFile(); };

// 		this.init();
// 	}

// 	init(){
// 		let data = {
// 			load_manager_id : this.id,
// 			load_manager_type : this.type
// 		};
// 		this.fileLoader.app.speakerctrl.initLM( data );
// 	}

// 	sendRequestToUploadFile(){
// 		this.fileLoader.app.speakerctrl.sendRequestToUploadFile( { details : { size : this.currentFile.size, type : this.type, load_manager_id : this.id } } );
// 	}

// 	sendFile(){

// 		// let send = () => { this.fileLoader.app.speakerctrl.sendFile( { file : this.fileReader.result, details : { size : this.currentFile.size, type : this.type, load_manager_id : this.id } } ) }
// 		// if ( this.fileReader.readyState < 2 ){
// 		// 	this.fileReader.onload = ( e ) => { send() };
// 		// } else {
// 		// 	send();
// 		// }
// 		//

// 	}

// 	bindToElement( elem ){
// 		elem.onclick = () => {
// 			let input = document.createElement("input");
// 			input.type = "file";
// 			input.onchange = ( e ) => {
// 				this.currentFile = input.files[0];

// 				this.fileReader.readAsDataURL( input.files[0] );
// 			} ;
// 			input.click();

// 		};
// 	}

// 	getId(){
// 		return this.id;
// 	}

// 	sendFileByParts(){
// 		for (let i = 0; i < this.fileReader.result.length / this.max_size ; i++){
// 			this.sendFilePart( i );
// 		}
// 		this.sendFileEnd();
// 	}

// 	sendFilePart( part ){
// 		console.log("part with index " + part + "attempt to sends");
// 		let filePart = this.fileReader.result.substr( this.max_size * part, this.max_size );
// 		this.fileLoader.app.speakerctrl.sendFilePart( { filePart : filePart , details : { size : this.currentFile.size, type : this.type, load_manager_id : this.id } } );
// 	}

// 	sendFileEnd(){
// 		this.fileLoader.app.speakerctrl.sendFileEnd( { details : { size : this.currentFile.size, type : this.type, load_manager_id : this.id } } );
// 	}



// }


// class FileLoader{ // TODO maybe FILE Loader Answerer in APP object wich will ???????????????????? ?????????? ???????????? ???????????? ???? ?????????????? ???????????????????????? ???????? ???????????????????? ?????????? ?????? ???????????? ???????????????? ???????? ???????????? ?? ???? ????????????.

// 	// const max_size = 3 * 1000;

// 	constructor(app){

// 		// this.dragNDropInit();
// 		this.initRoutes();

// 		this.app = app;
// 		this.lastId = 0;

// 		this.loadManagerList = [];

// 	}

// 	createLoadManager( type ){
// 		let lManager = new LoadManager( this, type );
// 		this.loadManagerList.push( lManager );
// 		return lManager;
// 	}

// 	getLoadManagerById (id) {
// 		return this.loadManagerList[id];
// 	}

// 	initRoutes(){
// 		this.routes = {
// 			"start_uploading_file" : "sendFile",
// 			"start_uploading_file_by_parts" : "sendFileByParts"
// 		};
// 	}



// 	// sendFileInfo( additionalData ){
// 	// 	app.socketctrl.sendFileInfo( { size : this.currentFile.size, additional_data : additionalData } );
// 	// }

// 	// dragNDropInit(){ // TODO make it's option to Load Manager object
// 	// 	return;
// 	// }

// 	// getProgress(){
// 		// return;
// 	// }



// }

