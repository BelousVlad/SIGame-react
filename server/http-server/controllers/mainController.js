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

	index(request, response) {
		let path_ = 'public/index.html';

		helper.getContent(path_, false)
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

		let path_;
		let encoding;
		if (extname === '.jpg' || extname === '.png' || extname === '.gif') {
			let mime_type;

			if(extname === '.jpg')
				mime_type = 'image/jpeg';
			else if (extname === '.jpg')
				mime_type = 'image/png'
			else if (extname === '.gif')
				mime_type = 'image/gif'
			res.setHeader('Content-Type', mime_type)
			path_ = path.join( config.rootPath, url)
		}
		else
		{
			path_ = path.join( config.rootPath , 'public', url)
			encoding = 'utf-8'
		}

		fs.readFile( path_, encoding, ( err, data ) => {
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
		const cookies = helper.parseCookies(req);

		const client = ClientManager.getClient( cookies.key );


		if (!client) {
			res.end('client not found');
			return;
		}

		const lobby = LobbyManager.getLobbyByClientKey( cookies.key );

		if ( !lobby ) {
			res.end('lobby not found');
			return;
		}

		console.log(client.key)

		console.log(lobby.master && lobby.master.key !== client.key)
		console.log(lobby.host && lobby.host.key !== client.key)

		if (!lobby.master || lobby.master.key !== client.key) {
			if(!lobby.host || lobby.host.key !== client.key)
			{
				res.end('you havent permission to upload lobby package');
			
				return;
			}
		}

		console.log('pack upload');

		lobby.uploadPackStart();
		// lobby.emit('lobby_pack_state_change');

		const form = formidable({
			uploadDir : config.packDirPath,
			maxFileSize : 200e6, //  ~200mb
			keepExtensions : false,
			multiple : false,
		});

		form.parse(req, async ( err, fields, file ) => {
			if ( err || !file.userfile ) {
				lobby.uploadPackEnd();
				res.end(JSON.stringify({message: 'upload failed'}));
				return;
			}

			const zip = new AdmZip(file.userfile.path);

			fs.mkdirSync( file.userfile.path + '_');
			await zip.extractAllTo(/*target path*/file.userfile.path + '_' , /*overwrite*/true);
			fs.rmSync( file.userfile.path );
			fs.renameSync( file.userfile.path + '_', file.userfile.path );
			lobby.packFolder = file.userfile.path;
			lobby.uploadPackEnd();
			res.end(JSON.stringify({message: 'upload succeed'}));
		});
	}

	follow_invite(req, res) {
		let cookies = helper.parseCookies(req) || new Object;
		let client = ClientManager.getClient(cookies.key) || new Object;

		if (!client) {
			// TODO
			// show page for authorization
			res.end('you havent complete authorization');
			return;
		}

		let lobbyId = req.url.split('?')[1].substring(3); // resieved arguments looks like 'id=123...', so we just rid out 'id='
		let lobby = LobbyManager.getLobbyById(lobbyId);

		if (!lobby) {
			// TODO
			// show page for "lobby not found"
			res.end('such lobby doesnt exist');
			return;
		}

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

	get_question_resource(req, res) {
		const cookies = helper.parseCookies(req) || new Object;
		const client = ClientManager.getClient(cookies.key);

		if (!client) {
			res.end('client not found.');
			return;
		}

		const lobby = LobbyManager.getLobbyByClient(client);

		if (!lobby) {
			res.end('client hasnt corresponding lobby');
			return;
		}

		// TODO
		// check if player has access for such resource

		const uri = req.url;
		const fileName = uri.substring( (uri.indexOf('?')) + 1 ).match(/name=([^&]+)/)?.[1];

		if (!fileName) {
			res.end('file not specified');
			return;
		}

		const fileExtension = fileName.substring( fileName.lastIndexOf('.') ).toLowerCase();
		let directoryName;

		// directoryName = 'Images';
		let mime_type;

		switch(fileExtension) {
			case '.jpg':
			case '.png':
			case '.gif':
				directoryName = 'Images';
				if(fileExtension === '.jpg')
					mime_type = 'image/jpeg';
				else if (fileExtension === '.png')
					mime_type = 'image/png'
				else if (fileExtension === '.gif')
					mime_type = 'image/gif'
				break;

			case '.mp4':
			case '.ogg':
				directoryName = 'Video';
				if (fileExtension === '.mp4')
					mime_type = 'video/mp4'
				else if (fileExtension === '.ogg')
					mime_type = 'video/ogg'
				break;

			case '.mp3':
				directoryName = 'Audio';
				mime_type = 'video/mpeg'
				break;

			default:
				res.end('invalid file extension');
				return;
		}

		const fullPath = lobby.packFolder + '/' + directoryName + '/' + fileName;

		res.setHeader('Content-Type', mime_type);
		fs.readFile(fullPath, undefined, (err, data) => {
			if (err) {
				console.error(err);
				res.end('failed to read file');
				return;
			}

			res.end(data);
		})
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
		let cookies = helper.parseCookies(req),
			client = ClientManager.getClient( cookies.key )

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
		let cookies = helper.parseCookies(req),
			client = ClientManager.getClient( cookies.key )

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