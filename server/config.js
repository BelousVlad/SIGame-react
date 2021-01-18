const path = require('path');


module.exports = ( {
	// PATHS
	helperClassPath : path.join( __dirname, 'helper.js'),
	errorPagePath : path.join( __dirname, 'technical pages', 'error page.html'),
	headerPagePath : path.join ( __dirname, 'technical pages', 'header.html' ),
	footerPagePath : path.join ( __dirname, 'technical pages', 'footer.html' ),
	logInPagePath : path.join( __dirname, 'technical pages', 'logIn.html'),
	publicFolderPath : path.join( __dirname, 'public' ),
	controllersPath : path.join ( __dirname, 'http-server', 'controllers'),
	packegesPath : path.join(__dirname, 'si-packs'),
	rootPath : __dirname,
} );