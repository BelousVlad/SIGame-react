const path = require('path');
const fs = require('fs');
const config = require( '../../config.js' );
const helper = require(config.helperClassPath);


module.exports = {
	html( req, res ){
		let url = (req.url).split('?')[0];
		let extname = path.extname(url);
		let path_ = path.join( config.rootPath , 'public', url);
		console.log(path_);
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
	},
	send( req, res ){
		let url = (req.url).split('?')[0];
		let path_ = path.join( config.rootPath , 'public', url);
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
	}
}