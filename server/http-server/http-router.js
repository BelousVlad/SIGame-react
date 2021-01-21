const path = require('path');
const config = require('../config');
const fs = require('fs');
const chalk = require('chalk');
const helper = require( config.helperClassPath );
const formidable = require( 'formidable' );


module.exports = class httpRouter{
	constructor( server ){
		this.initTemplates();
		this.server = server;
	}

	invoke(req, res){
		for ( let i in this.templates ) {

			if ( typeof this.templates[i] === 'function' ) {
				if ( this.templates[i]( req ) ) {
					require(path.join(  config.controllersPath, i.split('/')[0].concat('.js') ) ) /* import object */ [i.split('/')[1]]( req, res ); // use object method
					return;
				}
			}
			else if ( typeof this.templates[i] === 'string' ) {
				if ( new RegExp( this.templates[i] ).test( req.url ) ) {
					require(path.join(  config.controllersPath, i.split('/')[0].concat('.js') ) ) /* import object */ [i.split('/')[1]]( req, res ); // use object method
					return;
				}
			}
			else{
				throw 'invalid condition value'
			}
		}
	}

	initTemplates(){
		this.templates = {
			'mainController/get' : ( req ) => {
				return req.url === '/api/upload/pack' && req.method.toLowerCase() === 'post';
			},
			'mainController/send' : ( req ) => {
				let url = (req.url).split('?')[0];
				let extname = path.extname(url);
				switch ( extname ) {
					case '.css' : { return true;}
					case '.js' : { return true;}
					case '.ico' : { return true;}
					default : { return false;}
				}

			},
			'...' : ( req ) => {
				// let cookies = helper.parseCookies( req );
				// return !helper.isClientNameValid( cookies['clientName'] );
				return false;
			},

			// 'file/html' : ( req ) => { return true; },
			'mainController/main' : '.*',
		}
	}
}

