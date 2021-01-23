const path = require('path');
const config = require('../config');
const fs = require('fs');
const chalk = require('chalk');
const helper = require( config.helperClassPath );
const formidable = require( 'formidable' );
const ClientManager = require('../socket-server/ClientManager');
const routerTemapltes = require('./router-templates.js');

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
		this.templates = routerTemapltes;
	}
}

