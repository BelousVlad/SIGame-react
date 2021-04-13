const requireFromUrl = require('require-from-url/sync');
const Interface = requireFromUrl(config.interfaceClassPath);

class IFileLoader extends Interface {

	constructor(...args) {
		super(...args);
	}

	loadToClientsFile;

}

module.exports = IFileLoader;