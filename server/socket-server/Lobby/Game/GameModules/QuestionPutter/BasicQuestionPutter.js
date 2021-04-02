const AbstractQuestionPutter = require('./AbstractQuestionPutter');

class BasicQuestionPutter extends AbstractQuestionPutter {
	constructor(lobby, game)
	{
		super(lobby, game);
	}

	sendToClients(clients, question)
	{
		return new Promise((resolve, reject) => {
			for(let client of clients)
			{
				client.send('question', question);//TODO
			}
			resolve(clients);
		})
	}

}