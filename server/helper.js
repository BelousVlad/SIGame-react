

const path = require('path');
const fs = require('fs');


class helper{
	constructor(){
	}

	async readAllFiles(paths, callback, /* Optional */ error_handler ){
		let promises = [];
		let errors = [];
		for ( let i in paths ){
			promises.push( new Promise( ( res, rej ) => {
				fs.readFile( paths[i], 'utf-8', ( err, data ) => {
					if (err){
						let error_ = { 'index' : i, 'err' : err };
						let output = error_handler ? error_handler( error_ ) : '';
						errors.push( error_ );
						res (output);
					}
					else{
						res( data );
					}
				})
			}) )
		}
		Promise.all(promises).then( ( data ) => { callback( errors, data ) } );
	}

	isClientNameValid( name ){
		return !!name;
	}

	parseCookies (request) {
	    var list = {},
	        rc = request.headers.cookie;

	    rc && rc.split(';').forEach(function( cookie ) {
	        var parts = cookie.split('=');
	        list[parts.shift().trim()] = decodeURI(parts.join('='));
	    });

	    return list;
	}

}

module.exports = new helper();