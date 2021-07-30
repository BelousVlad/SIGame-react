const path = require('path')
const url = require('url')
const config = require('../config');
const helper = require( config.helperClassPath );
const ClientManager = require('../socket-server/ClientManager');
const LobbyManager = require('../socket-server/Lobby/LobbyManager');

module.exports =
{
	'mainController/upload_pack' : ( req ) => {
		return req.url === '/api/upload/pack' && req.method.toLowerCase() === 'post';
	},

	'mainController/upload_avatar' : ( req ) => {
		return req.url === '/api/upload/avatar' && req.method.toLowerCase() === 'post';
	},

	'mainController/get_avatar' : ( req ) => {
		var bool_ =  req.url.split('?')[0] === '/api/get/avatar' && req.method.toLowerCase() === 'get';
		return bool_;
	},

	'mainController/send' : ( req ) => {
		let url = (req.url).split('?')[0];
		let extname = path.extname(url);
		switch ( extname ) {
			case '.css' :
			case '.js' :
			case '.jpg' :
			case '.ico' : { return true;}
			default : { return false;}
		}
	},

	'mainController/index' : '*',

	'mainController/name' : ( req ) => {

        let cookies = helper.parseCookies(req);

        let client = ClientManager.getClient(cookies.key);

        return !(client && client.name);
    },

    'mainController/follow_invite' : ( req ) => {
    	var flag = Boolean(
    		req.url.split('?')[0] === '/follow' &&
    		req.method.toLowerCase() === 'get' &&
    		/^id=\d{1,10}$/.test(req.url.split('?')[1])
    	)

    	return flag;
    },

   	'mainController/get_question_resource' : ( req ) => {

    	var flag = Boolean(
    		req.url.split('?')[0] === '/get_question_resource' &&
    		req.method.toLowerCase() === 'get' &&
    		/^name=.+$/.test( req.url.substring( decodeURI(req.url.indexOf('?') + 1 ) ))
    	)
		
    	return flag;
    },

	'mainController/create_lobby' : '^/create-lobby$',
	'mainController/lobby' : '^/lobby$',
	'mainController/avatar_set_page' : '^/avatar_set$',
	'mainController/main' : '.*',
};