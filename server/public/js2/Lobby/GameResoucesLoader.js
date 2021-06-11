class GameResoucesLoader{
	constructor()
	{

	}

	loadRes(path, callback)
	{
		let exp = path.substr(path.lastIndexOf('.'));
		exp = exp.toLowerCase();
		if (exp === '.jpg' || exp === '.png' || exp === '.gif')
		{
			return this._loadImg(path, callback);
		}
		else if (exp === '.mp4' || exp === '.ogg')
		{
			return this._loadVideo(path, callback);
		}
		else if (exp === '.mp3')
		{
			return this._loadAudio(path, callback);
		}
	}

	_loadImg(path, callback)
	{
		let element = document.createElement('img'); 
		element.src = path;
		element.onload = callback;
		return element;
	}
	_loadVideo(path, callback)
	{
		let element = document.createElement('video');
		element.autoplay = 'autoplay';
		element.src = path;
		element.onloadeddata = callback;
		return element;
	}
	_loadAudio(path, callback)
	{
		let element = document.createElement('audio'); 
		element.src = path;
		element.autoplay = 'autoplay';
		element.onloadeddata = callback;
		return element;
	}
}