const path = require('path');
const config = require('./config');
const fs = require('fs');
const chalk = require('chalk');


class httpRouter{
	invoke(req, res){
		for ( let i in this.conditions ){
			if ( this.conditions[i]( req ) ){
				this.methods[i](req, res);
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
			'html' : ( req ) => { return true; }
		}
		this.methods = {
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
			'html' : ( req, res ) => {
				let url = (req.url).split('?')[0];
				let extname = path.extname(url);
				let path_ = path.join(__dirname, 'public', url);
				if ( extname == '' )
					path_ = path.join(path_, 'index.html');




				// try{
				fs.readFile( config.headerPagePath, 'utf-8', (err, dataHeader) =>{ // тут идет хардкод добавления хедера и футера всем хтмл страницам.
					if (err)
						console.log( chalk.red( err ) );
					// res.write(data);
					fs.readFile( path_, 'utf-8', async (err, dataMain) => {
						if (err || dataMain === 'undefined'){
							await fs.readFile( config.errorPagePath, 'utf-8', (err, data) =>{
								if (err ){

									res.end('no way =(');
								}
								res.end(data);
							} )
							// console.log(1);
						}
						// res.write(data);

						fs.readFile( config.footerPagePath, 'utf-8', (err, dataFooter) => {
							if (err)
								console.log( chalk.red( err ) );
							// res.end(data);
							let data = dataHeader + dataMain + dataFooter;
							res.end(data);
						})
					})

				} ) /////////////////////////////
				// } catch( e ){
				// 	console.log( chalk.red(e));
				// 	fs.readFile( config.errorPagePath, 'utf-8', (err, data) => {
				// 		if (err)
				// 			res.end('No way =(.');
				// 		else
				// 			res.end(data);
				// 	})
				// }
				// fs.readFile( path_, 'utf-8', (err, data)=>{
				// 	if (err){
				// 		console.log( chalk.red(err)) ;
				// 		fs.readFile ( config.errorPagePath, 'utf-8', (err, data) => {
				// 			if (err){
				// 				fun('No way, man =(.');
				// 			} else {
				// 			fun(data);
				// 			}
				// 		})
				// 	} else {
				// 		fun( data );
				// 	}
				//})
			}
		}
	}
}

module.exports = (new httpRouter());
