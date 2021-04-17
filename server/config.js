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
	mainPagePath : path.join(__dirname, 'public', 'main.html'),
	rootPath : __dirname,
	packDirPath : path.join( __dirname, 'si-packs'),
	avatarDirPath : path.join ( __dirname, 'avatars' ),
	baseAvatarCode : 'baseAvatar.jpg',
	baseAvatarPath : path.join(__dirname, 'avatars', 'baseAvatar.jpg' ),
	timerPath : path.join(__dirname, 'experimental_code.js'),
	packReaderPath : path.join(__dirname, 'socket-server', 'PackReader', 'PackReader.js'),
	interfaceClassPath : `https://raw.githubusercontent.com/ynoplanetashka1/cookbook-js/main/interface.js`,
});
