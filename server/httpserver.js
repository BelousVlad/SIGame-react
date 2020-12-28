const http = require('http');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const router = require('./http-router')


http.createServer( (req, res) => {

	let url = req.url;
	url = url.split('?')[0]; // erase GET part

	let extname = path.extname(url);

	switch( extname ){ // set Content-Type header
		case '.css' : {

			res.setHeader('Content-Type', 'text/css');
			break;
		}
		case '.ico' : {
			// dirty favicon.ico =(
			break;
		}
		case '.js' : {

			res.setHeader('Content-Type', 'text/javascript');
			break;
		}
		case '.html' : case '' : {

			res.setHeader('Content-Type', 'text/html');
			break;
		}
		default : {
			console.log(extname == '');
			res.setHeader('Content-Type', 'text/plain');
		}
	}

	router.invoke( req, res );




}).listen( 3000, () =>{
	console.log( chalk.yellow('Server Started.' ));
})


