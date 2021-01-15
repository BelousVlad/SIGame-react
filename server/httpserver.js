const http = require('http');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Router = require('./http-router')


module.exports = class HttpServerW{
	constructor( app ){
		this.router = new Router( this );
		this.server = http.createServer( ( (request, response) => {

			let url = request.url;
			url = url.split('?')[0]; // erase GET part

			let extname = path.extname(url);

			switch( extname ){ // set Content-Type header
				case '.css' : {

					response.setHeader('Content-Type', 'text/css');
					break;
				}
				case '.ico' : {
					// dirty favicon.ico =(
					break;
				}
				case '.js' : {

					response.setHeader('Content-Type', 'text/javascript');
					break;
				}
				case '.html' : case '' : {

					response.setHeader('Content-Type', 'text/html');
					break;
				}
				default : {
					// console.log(extname == '');
					response.setHeader('Content-Type', 'text/plain');
				}
			}

			this.router.invoke( request, response );

		}).bind( this ));

		this.app = app;

		this.server.listen( 3000, () =>{
			console.log( chalk.yellow('http-Server started.' ));
		});
	}
}