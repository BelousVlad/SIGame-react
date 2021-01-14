const path = require('path');
const config = require('./config');
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
		for ( let i in this.conditions ){
			if ( this.conditions[i]( req ) ){
				this.methods[i](req, res);
				break;
			}
		}
	}

	initTemplates(){
		this.conditions = {
			// 'in-game' : ( req ) => {
			// 	return false;
			// 	// check cookies whenether client in certain lobby or not.
			// },
			'file-upload-pack' : ( req ) => {
				return req.url === '/api/upload/pack' && req.method.toLowerCase() === 'post';
			},
			'non-html' : ( req ) => {
				let url = (req.url).split('?')[0];
				let extname = path.extname(url);
				switch ( extname ) {
					case '.css' : { return true;}
					case '.js' : { return true;}
					case '.ico' : { return true;}
					default : { return false;}
				}

			},
			'html-no-name' : ( req ) => {
				let cookies = helper.parseCookies( req );
				return !helper.isClientNameValid( cookies['clientName'] );
				// return !cookies['clientName'];
			 },

			'html' : ( req ) => { return true; }
		}
		this.methods = {
			// 'in-game' : ( req, res ) => {
			// 	return;
			// 	//;
			// },
			'file-upload-pack' : ( req, res ) => {
				let form = formidable({
					uploadDir : config.packegesPath,
					keepExtensions : true
				});
				form.parse( req, (err, fields, files) => {
					if (err)
						throw err;

				});
			},
			'non-html' : ( req, res ) => {
				let url = (req.url).split('?')[0];
				let path_ = path.join(__dirname, 'public', url);
				fs.readFile( path_, 'utf-8', ( err, data ) => {
					if (err){
						fs.readFile( config.errorPagePath, 'utf-8', (err, data)=>{
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

			},
			'html-no-name' : ( req, res ) => {
				helper.readAllFiles( [ config.headerPagePath, config.logInPagePath, config.footerPagePath ], ( err, data ) => {
					if (err.length){
						fs.readFile( config.errorPagePath, 'utf-8', ( err_, data_ ) =>{
							if (err_){
								res.end('no way=(');
							} else {
								res.end( data_ );
							}
						})
					} else {
						res.end( data.join('') );
					}
				} )
			},
			'html' : ( req, res ) => {
				let url = (req.url).split('?')[0];
				let extname = path.extname(url);
				let path_ = path.join(__dirname, 'public', url);
				if ( extname == '' )
					path_ = path.join(path_, 'index.html');

				let paths = [ config.headerPagePath, path_, config.footerPagePath ]

				helper.readAllFiles( paths, ( err , data ) =>{
					if ( err.length ) {
						fs.readFile( config.errorPagePath, 'utf-8', ( error, data_ )=>{
							if (error){
								res.end('no way =(');
							} else {
								res.end(data_);
							}
						})
					} else {
						data = data.join('');
						res.end(data);
					}
				} )

			}
		}
	}
}

