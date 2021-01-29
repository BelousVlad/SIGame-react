const Message = require('./Message');
const event = require('events');

class Chat {
	
	constructor(lobby)
	{
		Object.assign( this, new event() )
		this.lobby = lobby;
		this.messages = [];
	}

	addMessage(client, text)
	{
		let message = new Message(client, text);
		this.messages.push(message)
		this.emit('lobby_chat_message_added', message);
	}

}

Object.assign( Chat.prototype, event.prototype )

module.exports = Chat;