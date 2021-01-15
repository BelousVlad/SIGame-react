let HttpServerW = require('./httpserver.js');
let SocketServerW = require('./socket-server/socketserver.js');

class App{
	constructor(  ){
		this.socketServerW = new SocketServerW( this );
		this.httpServerW = new HttpServerW( this );
	}
}

let app = new App();