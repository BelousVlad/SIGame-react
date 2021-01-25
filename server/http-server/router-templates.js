const path = require('path')
const config = require('../config');
const helper = require( config.helperClassPath );
const ClientManager = require('../socket-server/ClientManager');

module.exports =
{
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
	'mainController/name' : ( req ) => {

        let cookies = helper.parseCookies(req);

        let client = ClientManager.getClient(cookies.key);

        return !(client && client.name);
    },
	'mainController/name' : ( req ) => {

		let cookies = helper.parseCookies(req);

		let client = ClientManager.getClient(cookies.key);

		return !(client && client.name);
	},

	'mainController/create_lobby' : 'create-lobby',
	'mainController/lobby' : 'lobby',
	'mainController/main' : '.*',
};