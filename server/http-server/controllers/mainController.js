const path = require('path');
const fs = require('fs');
const config = require( '../../config.js' );
const helper = require(config.helperClassPath);
const ClientManager = require('../../socket-server/ClientManager');
const LobbyManager = require('../../socket-server/Lobby/LobbyManager');
const AdmZip = require('adm-zip');
const formidable = require('formidable');


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

		let extname = path.extname(url);
		if (extname === '.ico') {
			res.end('');
			return;
		}

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

	upload_pack ( req, res ) {
		let cookies = helper.parseCookies(req);

		let lobby = LobbyManager.getLobbyByClientKey( cookies.key );
		// console.log(lobby, 'tttttttttttttt');

		if ( !lobby )
			return;

		lobby.uploadPackStart();
		lobby.emit('lobby_pack_state_change');

		const form = formidable({
			uploadDir : config.packDirPath,
			maxFileSize : 200e6, //  ~200mb
			keepExtensions : false,
			multiple : false,
		});

		form.parse(req, async ( err, fields, file ) => {
			if ( err || !file.userfile )
				return;

			let zip = new AdmZip(file.userfile.path);

			fs.mkdirSync( file.userfile.path + '_');
			await zip.extractAllTo(/*target path*/file.userfile.path + '_' , /*overwrite*/true);
			fs.rmSync( file.userfile.path );
			fs.renameSync( file.userfile.path + '_', file.userfile.path );
			lobby.packFolder = file.userfile.path;
			lobby.uploadPackEnd();

		});
	}

	follow_invite(req, res) {
		let cookies = helper.parseCookies(req) || new Object;
		let client = ClientManager.getClient(req.key) || new Object;

		if (!client) {
			// TODO
			// show page for authorization
			res.end('you havent complete authorization');
			return;
		}

		let lobbyId = req.url.split('?')[1].substring(3); // get arguments looks like 'id=123...', so we just getting our id argument
		let lobby = LobbyManager.getLobbyById(lobbyId);

		if (!lobby) {
			// TODO
			// show page for "lobby not found"
			res.end('such lobby doesnt exist');
			return;
		}

		// TODO lobby.hasPassword() method
		if (lobby.hasPassword()) {
			// TODO
			// show page for "enter password"
			res.end('enter lobby password');
		}

		//next goes successful lobby entering
		// it implementation is simple make, client join lobby, if possible, afther that redirect him to /lobby page

		// TODO
		res.end('successful entering...');
	}

	avatar_set_page( req, res ) {
		let path_ = 'public/avatar/set_avatar.html';

		helper.getContent(path_)
		.then((data) => {
			res.end(data)
		})
		.catch( () => {
			res.end( 'no way.' );
		} )
	}

	upload_avatar ( req, res ) {
		let cookies = helper.parseCookies(req)
		,	client = ClientManager.getClient( cookies.key )

		if( !client)
			return;



		const form = formidable({
			uploadDir : config.avatarDirPath,
			maxFileSize : 200e6, //  ~200mb
			keepExtensions : true,
			multiple : false,
		});

		form.parse( req, ( err, fields, file ) => {
			if ( err || !file.userfile )
				return;

			if ( client.avatarPath ) {
				fs.rmSync( client.avatarPath );
			}

			client.avatarPath = file.userfile.path;
			client.avatarCode = path.parse( ( client.avatarPath ) ).base; /* just filename */
			// client.uploadAvatarEnd();
			// ----------------TODO
			// change
			client.send( 'avatar_set_succeed', {} );
		} )
	}

	get_avatar( req, res ) {
		let cookies = helper.parseCookies(req)
		,	client = ClientManager.getClient( cookies.key )

		if( !client)
			return;

		res.setHeader('Content-Type', 'image/jpeg');
		(async function() {
			try{
				const file = fs.readFileSync( client.avatarPath );
				res.end(file);
			} catch ( e ) {
				try {
					const file = fs.readFileSync( config.baseAvatarPath );
					res.end( file );
				} catch ( e ) {
					console.log( e );
				}
			}
		})();
	}
}

module.exports = new MainController();