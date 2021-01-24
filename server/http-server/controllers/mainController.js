const path = require('path');
const fs = require('fs');
const config = require( '../../config.js' );
const helper = require(config.helperClassPath);
const ClientManager = require('../../socket-server/ClientManager');
const LobbyManager = require('../../socket-server/LobbyManager');



class MainController{
	html(request, response) {
		
		let url = (request.url).split('?')[0];
		let extname = path.extname(url);

		let path_ = path.join( config.rootPath , 'public', url);
		if ( extname == '' )
			path_ = path.join(path_, 'main.html');

		helper.getContent(path_)
		.then((data) => {
			response.end(data)
		})
	}

	main(request, response)
	{
		let path_ = config.mainPagePath;

		helper.getContent(path_)
		.then((data) => {
			response.end(data)
		})
	}

	name(request, response)
	{
		let path_ = 'technical pages/login.html';

		helper.getContent(path_)
		.then((data) => {
			response.end(data)
		})
	}

	create_lobby(request, response)
	{
		let path_ = 'public/lobby/create_lobby.html';

		helper.getContent(path_)
		.then((data) => {
			response.end(data)
		})
	}
	lobby(request, response)
	{

		let cookies = helper.parseCookies(request);

		let client = ClientManager.getClient(cookies.key);

		if (client && LobbyManager.isPlayerIntoLobby(client))
		{
			let path_ = 'public/lobby/lobby.html';

			helper.getContent(path_)
			.then((data) => {
				response.end(data)
			})
		}
		else
		{
			response.statusCode = 302;
			response.setHeader('Location', '/')
			response.end();
		}
	}
	/* Хуйня
	create_lobby_input(request, response)
	{
		let cookies = helper.parseCookies(request);

		let client = ClientManager.getClient(cookies.key);

		if (client)
		{
			let data = '';
			request.on('data', (chunk) => {
				data += chunk;
			});
			request.on('end', () => {
				let post = helper.parseChunk(data);

				let lobby = ClientManager.create_lobby

			});

		}
	}
	*/
	send( req, res ){
		let url = (req.url).split('?')[0];
		let path_ = path.join( config.rootPath , 'public', url);
		fs.readFile( path_, 'utf-8', ( err, data ) => {
			if (err){
				fs.readFile( config.errorPagePath, 'utf-8', (err, data) => {
					if (err){
						res.end('No way man =(.');
					} else {
						res.end(data);
					}
				})
			} else {
				res.end(data);
			}
		})
	}
}

module.exports = new MainController();