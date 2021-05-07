class Lobby {
	constructor(info, players, position, view)
	{
		this._info = info;
		this._view = view;
		this._position = position;
		this.players = players;

	}

	get players() { return this._players }
	set players(data) { 
		this._players = data;
		this._view.renderPlayers(this._players, this._position);
	} //mb TODO

	get info() { return this._info }
	set info(data) { this._info = data } //mb TODO

	get position() { return this._position }
	set position(data) { this._position = data } //mb TODO
}