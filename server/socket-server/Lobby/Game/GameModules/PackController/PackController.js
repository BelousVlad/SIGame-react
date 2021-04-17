const GameModule = require('../GameModule');
const PackReader = require('./PackReader/PackReader');

class PackController extends GameModule {
	contructor(lobby, game)
	{
		super(lobby, game);
		this.pack_reader = new PackReader();
		this.pack_;
	}

	setPack(packFolder)
	{
		return this.pack_reader.getPackFromFolder(packFolder).
			then((pack) => {
				this.pack_ = pack;
				return pack;
			});
	}



}

module.exports = PackController;