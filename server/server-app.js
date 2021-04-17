const HttpServerW = require('./http-server/httpserver.js');
const SocketServerW = require('./socket-server/socketserver.js');

class App {
	constructor() {
		this.socketServerW = new SocketServerW( this );
		this.httpServerW = new HttpServerW( this );
	}
}

const app = new App();