class Game
{
	constructor(round, view, current_choosing_player)
	{
		this._view = view;
		this._round = round;
		this._process_text = '';
		this._current_choosing_player = current_choosing_player; /* possible values: null, {player_name: string, is_you: boolean} */
	}

	get round() { return this._round }
	set round(data) {
		this._round = data;

		if (data)
			this._view.viewRoundInfo(data);
	}

	set process_text(text)
	{
		this._process_text = text;
		this._view.showProcessText(text);
	}

	get current_choosing_player() { return this._current_choosing_player; }
	set current_choosing_player(data)
	{
		let text = `Cейчас выбирает игрок ${data.player_name}`;
		this._view.showProcessText(text);
		this._view.setTimer(data.time);

		this._current_choosing_player = {
			player_name: data.player_name,
			is_you: data.is_you
		};
	}

	loadResources(data)
	{
		this._question_resources = [];
		this._view.viewMainLoader();
		let promises = [];
		for(let res of data)
		{
			promises.push(
				new Promise((resolve, reject) => {

					if (res.value)
					{
						if (res.value.startsWith('@'))
						{
							let loader = new GameResoucesLoader();
							let uri_ = `/get_question_resource?name=${encodeURI(res.value.substring(1))}`;
                            this._question_resources.push(loader.loadRes(uri_, resolve));
						}
						else
						{
							let elem = document.createElement('div');
							elem.innerText = res.value;
							this._question_resources.push(elem);
							resolve();
						}
                    }
                    else
                    {
                        this._question_resources.push(null);
                        resolve();
                    }
                })
			)
		}
		return Promise.all(promises);
	}

	canReply(data)
	{
		if (data)
		{
			console.log(data);
			this.process_text = 'Кто желает отвечать?'
			this._view.enableAnswerButton()
			this._view.setTimer(data.time)
				.then(() => {
					this.can_reply = false;
				})
		}
		else
		{
			this._view.disableAnswerButton()
		}
	}

	setQuestionStage(stage_data)
	{
		let number = stage_data.stage_number;
		let time = stage_data.time;
        console.log(this._question_resources[number]);
		this._view.showQuestionStage(
			this._question_resources[number],
			time
		);
	}

	questionProcess(data)
	{
		this._view.showQuestionProcessPlayers(data.reply_clients);
		this._view.setTimer(data.time);
	}

	replyQuestion(data)
	{
		this._view.inputTextPopup(data.time)
		.then((text) => {
			app.ServerCommandManager.sendQuestionAnswer(text);
		})
	}

	setAnswers(data)
	{
		for(let player of data.reply_clients)
		{
			this._view.showPlayerAnswer(player, player.answer, app.lobby.position.is_master);
		}
		if (data.time)
			this._view.setTimer(data.time);
	}
}
//%D1%80%D0%B0%D1%88%D0%B5%D0%BD%20%D0%B4%D0%B8%D0%BA%D0%B0%D0%BF%D1%80%D0%B8%D0%BE%2001.jpg
//%D1%80%D0%B0%D1%88%D0%B5%D0%BD%20%D0%B4%D0%B8%D0%BA%D0%B0%D0%BF%D1%80%D0%B8%D0%BE%2002.jpg

