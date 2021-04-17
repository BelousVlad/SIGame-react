const path = require('path');
const fs = require('fs');
const config = require( './config.js' );


class helper{
	constructor(){
	}

	validLobbyPassword( password ) { // password length should be in range 5 - 15
		return /\w{5,15}/.test( password )
	}

	readAllFiles(paths){
		let promises = [];
		for ( let i in paths ){
			promises.push(new Promise((res, rej) => {
				fs.readFile(paths[i], 'utf-8',( err, data ) => {
					if (err){
						let error_ = { 'index' : i, 'err' : err };
						rej(error_);
					}
					else{
						res(data);
					}
				})
			}))
		}
		return Promise.all(promises)
		.catch((err) => {
			console.log(err)
		})
	}
	//withHeaderFooter
	// true - с хедером и футером
	// false - без
	getContent(path_, withHeaderFooter = true)
	{
		let paths;
		if (withHeaderFooter)
			paths = [ config.headerPagePath ,path_ ,config.footerPagePath ]
		else
			paths = [ path_ ]

		return this.readAllFiles(paths)
		.then((data) => {
			data = data.join('');
			return data;
		})
		/*
		.catch((error) => {
			fs.readFile(config.errorPagePath, 'utf-8', ( error, data_ ) => {
				if (error) {

					return error;

				} else {

					return data_;

				}
			})
		})
		*/
	}

	parseCookies (request) {
	    let list = {},
	        rc = request.headers.cookie;

	    rc && rc.split(';').forEach(function( cookie ) {
	        let parts = cookie.split('=');
	        list[parts.shift().trim()] = decodeURI(parts.join('='));
	    });

	    return list;
	}
	parseChunk (str) {
	    let list = {};

	    str.split('&').forEach(function( cookie ) {
	        let parts = cookie.split('=');
	        list[parts.shift().trim()] = decodeURI(parts.join('='));
	    });

	    return list;
	}

}

module.exports = new helper();