const path = require('path');
const config = require('./config');
const fs = require('fs');
const chalk = require('chalk');


class httpRouter{
	invoke(req, fun){
		for ( let i in this.conditions ){
			if ( this.conditions[i]( req ) ){
				this.methods[i](req, fun);
				break;
			}
		}
	}

	constructor(){
		this.conditions = {
			'non-html' : ( req ) => {
					let url = (req.url).split('?')[0];
					let extname = path.extname(url);
					switch ( extname ) {
						case '.css' : { return true;}
						case '.javascript' : { return true;}
						case '.ico' : { return true;}
						default : { return false;}
					}

			},
			'default' : ( req ) => { return true; }
		}
		this.methods = {
			'non-html' : ( req, fun ) => {
				let url = (req.url).split('?')[0];
				let path_ = path.join(__dirname, 'public', url);
				fs.readFile( path_, 'utf-8', ( err, data ) => {
					if (err){
						fs.readFile( config.errorPagePath, 'utf-8', (err, data)=>{
							if (err){
								fun('No way man =(.');
							} else {
								fun(data);
							}
						})
					} else {
						fun(data);
					}
				})

			},
			'default' : ( req, fun ) => {
				let url = (req.url).split('?')[0];
				let extname = path.extname(url);
				let path_ = path.join(__dirname, 'public', url);
				if ( extname == '' )
					path_ = path.join(path_, 'index.html');
				fs.readFile( path_, 'utf-8', (err, data)=>{
					if (err){
						console.log( chalk.red(err)) ;
						fs.readFile ( config.errorPagePath, 'utf-8', (err, data) => {
							if (err){
								fun('No way, man =(.');
							} else {
							fun(data);
							}
						})
					} else {
						fun( data );
					}
				})
			}
		}
	}
}

module.exports = (new httpRouter());
