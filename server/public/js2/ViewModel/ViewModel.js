class ViewModel {
	constructor()
	{

	}

	showLobbyList(lobby)
	{
		console.log(lobby);
		let html = lobby.reduce((sum,item, index) =>
			sum +
			`<div class="lobby-list-item" data-index="${index}" id="${item.info.id}" title='${item.info.title}' is_password="${item.info.is_password}">
				<div class="lobby-list-item-title">${item.info.title}</div>
				<div class="lobby-list-item-players-count">
					${item.players.length}/${item.info.max_players}
				</div>
			</div>`
		,"");

		$(".lobby-list").html(html);
	}

    showMenuLobbyInfo(lobby)
    {
		// console.log(lobby)
		$('.menu-info-title').text(lobby.info.title);
		const host = this._getHost(lobby.players);
        $('.menu-info-host-value').text(host.name ? host.name : '');
        const master = this._getMaster(lobby.players)
        $('.menu-info-master-value').text(master ? master.name : '');
        const players = lobby.players.reduce((acc, item) => acc + `
            ${ item.name },
        `, '');
        $('.menu-info-players-value').text(players);
    }

	renderPlayers(players, position)
	{
		let html = '';
		for(let player of players)
		{
			if (player.is_master)
				this.renderMaster(player, position);
			else
				html += this.getPlayerBanner(player, position)
		}

		$(".players-container").html(html);
	}

	renderBecameMasterBtn()
	{
		let html = `<div class="controll-btn become-master-btn">Стати провідним</div>`;
		$(".lobby-master-box").html(html);
	}

	getPlayerBanner(player, position)
	{
		let builder = new PlayerBannerBuilder();

		builder.BuildScore(player.score);
		builder.BuildName(player.name);
		builder.BuildAvatar(player.avatar);
		if (position.is_host)
		{
			builder.BuildMasterMenu();
			builder.BuildHostMenu();
		}
		else if (position.is_master)
			builder.BuildMasterMenu();

		return builder.getResult();
	}

	renderMaster(player, position)
	{
		let builder = new PlayerBannerBuilder();

		builder.BuildName(player.name);
		builder.BuildAvatar(player.avatar);
		if (position.is_host)
			builder.BuildHostMenu();

		let html = builder.getResult();
		if (position.is_master)
			html += this.getStopMasterButton();

		$(".lobby-master-box").html(html);
	}

	getStopMasterButton()
	{
		return `<div class="controll-btn stop-master-btn">Перестати бути провідним</div>`;
	}

	viewPasswordPopup()
	{
		return new Promise((resolve, reject) => {
			let element = $(`
				<div class="popup-bg">
				    <div class="container popup-container">
				        <input placeholder="Ведiть пароль" class="app-input" type="password" name="password">
				        <input class="controll-btn send-password-btn" type="button" name="password-btn" value="Відправити">
				    </div>
				</div>
			`)
			$(element).find('.popup-container').click(function(e){
				return false;
			});
			$(element).find('input[name=password-btn]').click(function(e){
				let password = $(element).find('input[name=password]').val();

				resolve({password, element})
			})

			$(element).click(function(e){
				$(this).remove();
				reject(element)
			})

			$('.wrapper').append(element)
		})
	}

	viewRoundInfo(input_)
	{
		let themes = input_.themes;
		let prices = input_.prices;
		let container = $(`.lobby-game-container`);
		let result = '';

		// fill array with empty items to achive same items count.
		let maxQuestionsInTheme = Math.max( ...prices.map(item => item.length) );
		prices = prices.map(priceList => {
			while (priceList.length < maxQuestionsInTheme)
				priceList.push('');
			return priceList;
		})

		for (let i = 0; i < themes.length; i++) {
			result +=
				`
					<div class="theme-container">
						<div class="theme-box">
							${themes[i]}
						</div>
						${prices[i].reduce((accamulator, item, index) => {
							return accamulator +
							`
							<div class="question-box round-question theme-question" data-theme-index="${i}" data-question-index="${index}">
								${item ?? ''}
							</div>
							`
						}, '')}

					</div>
				`;
		}

		container.html(result);
	}

	enableAnswerButton()
	{
		$('.game-answer-btn').removeAttr('disabled');
		$('.game-answer-btn').removeClass('controll-btn-disabled');
	}

	disableAnswerButton()
	{
		$('.game-answer-btn').prop('disabled', true);
		$('.game-answer-btn').addClass('controll-btn-disabled');
	}

	showProcessText(text)
	{
		$('.process-text').text(text);
	}

	showMainText(text)
	{
		$('.lobby-game-container').html(`<span class="game-main-text">${text}</span>`);
	}

	getProcessText()
	{
		return $('.process-text').text();
	}

	showPregameInfo(authorList, time)
	{
		console.log(authorList);
		$('.lobby-game-container').html(`<span class="author-list">Aвтори: ${authorList.join(', ')}</span>`);
		this.setTimer(time);
		// setTimeout(() =>
		// 	{
		// 		$('.lobby-info-container').hide();
		// 		$('.lobby-info-container').text('');
		// 	},
		// time
		// );
	}

	showRoundTitle(title, time)
	{
		$('.lobby-game-container').html(`<span class="game-round-title">Назва раунда: ${title}</span>`);

		this.setTimer(time);
	}

	showQuestionStage(element, time)
	{
		$('.lobby-game-container').html(element);

		if (time)
		{
			this.setTimer(time);
		}
	}

	setTimer(time)
	{
		return new Promise((resolve, reject) => {
			if (this.timer)
			{
				this.timer.forceFail();
			}

			setTimeout(() => {
				$('.process-loader .loader').css('animation-duration', time+'ms');
				$('.process-loader').addClass('active')
				this.timer = new Timer(time, {
					success: function(...args) {
						$('.process-loader').removeClass('active')
							resolve(...args);
					},
					fail: function(...args) {
						$('.process-loader').removeClass('active')
							resolve(...args);
					}
				});
			}, 50)
		})
	}

	viewMainLoader()
	{
		if (this.timer)
		{
			this.timer.forceSuccess();
		}
		$('.lobby-game-container').html(
			`<div class="main-game-loader">
				<div class="lds-grid">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>`)
	}

	showQuestionProcessPlayers(players)
	{
		let clients_html = players.reduce((sum, player) => sum + `
			<div class="question-process-player">
				<div class="question-process-player-name">
					${player.name}
				</div>
			</div>
			`, '');

		let html = `<div class="question-process-player-container">
			<div class="question-process-text">Відповідаючі гравці: </div>
			${clients_html}
		</div>`

		$('.lobby-game-container').html(html);
	}

	inputTextPopup(time)
	{
		let el = document.createElement('div');
		let bg = this._createPopupBackground();
		return new Promise((resolve, reject) => {
			$(el).addClass('input-text-popup');
			$(el).html(`
				<input class="app-input" type="text" name="text"/>
				<button class="controll-btn input-text-popup-btn">Ок</button>
			`)

			$(el).find('.input-text-popup-btn').click(function(e) {
				let text = $(el).find('input').val().trim();
				resolve(text);
			})

			if (time)
			{
				if (this.popup_timer)
					this.popup_timer.forceSuccess();
				this.popup_timer = new Timer(time,{
					success: () => {
						$(el).find('.input-text-popup-btn').trigger('click')
					},
					fail: () => {
						$(el).find('.input-text-popup-btn').trigger('click')
					}
				})
			}

			$('.wrapper').append(bg);
			$('.wrapper').append(el);
		})
		.then((text) => {
			$(el).remove()
			$(bg).remove()
			return text;
		})
	}

	showPlayersAnswers(players, answer, is_show_btns)
	{
		// $(`.players-container .player-box[data-name=${player.name}]`).each((i, banner) => {
		// 	let answer_box = document.createElement('div');
		// 	answer_box = $(answer_box);
		// 	answer_box.addClass('player-answer-box');
		// 	answer_box.html(`
		// 		<div class="answer-box-btns">
		// 		${
		// 			is_show_btns ?
		// 			`<button class="answer-box-btn-yes">Верно</button>
		// 			<button class="answer-box-btn-no">Не верно</button>` : ''
		// 		}
		// 		</div>
		// 		<div>
		// 			${answer}
		// 		</div>
		// 	`)
		// 	$(banner).append(answer_box.get(0));
		// })

		const container = $(`<div class="answers-picker-container"></div>`)
		let players_elements = '';

		const btns = `
			<div class="answer-box-player-btns">
				<button class="controll-btn answer-box-player-yes">
					Вiрно
				</button>
				<button class="controll-btn answer-box-player-no">
					Не вiрно
				</button>
			</div>
		`;

		players.forEach(player => {
			let builder = new PlayerBannerBuilder();
			builder.BuildAvatar(player.avatar);
			builder.BuildName(player.name);
			let element = `
			<div class="answer-box" data-player="${player.name}">
				<div class="answer-player-box">
					${builder.getResult()}
				</div>
				<div class="answer-box-player-answer">
					${player.answer}
				</div>
				${ is_show_btns ? btns : '' }
			</div>`

			players_elements += element;
		});

		let right_elem = `<div class="answer-right-box"></div>`;
		console.log(answer)
		let right_elems = answer.reduce((acc, item, i) => acc + `
			<div class="answer-right-item">
				<span>№${i+1}</span> <span>${item.value}</span>
			</div>
		`, '')
		right_elem = $(right_elem);
		right_elem.append(right_elems);

		$(container).append(right_elem);
		$(container).append(players_elements);

		$('.wrapper').append(this._createPopupBackground());
		$('.wrapper').append(container);
	}

	hidePlayersAnswers() 
	{
		$('.answers-picker-container, .black-popup-screen').remove()
	}

	addChatMessage(player, text)
	{
		$('.lobby-chat').append(`
			<div class="chat-message">
				<span class="chat-message-from">${player.name}</span>
				<span>: </span>
				<span class="chat-message-text">${text}</span>
			</div>
		`)
	}

	renderLobbyInfo(info, host, master)
	{
		$('.lobby-game-container').html(`
			<h3 class="lobby-info-title">${info.title}</h3>
			<p class="lobby-info-field lobby-info-max-players">Максимум гравців: ${info.max_players}</p>
			<p class="lobby-info-field lobby-info-master">Провідний: ${master ? master.name : " - "}</p>
			<p class="lobby-info-field lobby-info-host">Власник: ${host ? host.name : ' - '}</p>
		`);
	}

	showEndGame(players, winners)
	{
		let html = '<h2>Переможець</h2>';
		
		let winner = players[0]
		players.forEach(item => {
			if(item.score > winner.score)
				winner = item;
		})

		html += `<div class="win-player">${winner.name} </div>`
		html += '<div> Також приймали участь: </div>'
		
		html += players.reduce((acc, player) => acc + `
			<span>${player.name}, </span>
		`, '');
		$('.lobby-game-container').html(`<div class="end-game-title">${html}</div>`);

		this.showProcessText('Вітаємо переможців!');
	}

	view_bet_popup(timeout)
	{
		return this.inputTextPopup(timeout)
	}

	_getMaster(players)
    {
        return players.find((item) => item.is_master)
    }
	_getHost(players)
    {
        return players.find((item) => item.is_host)
    }
	_createPopupBackground()
	{
		const bg = document.createElement('div')
		$(bg).addClass('black-popup-screen');
		return bg;
	}
}