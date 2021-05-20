class ViewModel {
	constructor()
	{

	}

	showLobbyList(arr)
	{
		console.log(arr);
		let html = arr.reduce((sum,item) =>
			sum +
			`<div class="lobby-list-item" id="${item.id}" title='${item.title}' is_password="${item.is_password}">
				<div class="lobby-list-item-title">${item.title}</div>
				<div class="lobby-list-item-players-count">
					${item.players_count}/${item.max_players}
				</div>
			</div>`
		,"");

		$(".lobby-list").html(html);
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
		let html = `<div class="become-master-btn">Стать ведущим</div>`;
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
		if (position.is_host)
			html += this.getStopMasterButton();

		$(".lobby-master-box").html(html);
	}

	getStopMasterButton()
	{
		return `<div class="stop-master-btn">Перестать быть ведущим</div>`;
	}

	viewPasswordPopup()
	{
		return new Promise((resolve, reject) => {
			let element = $(`
				<div class="popup-bg">
				    <div class="container popup-container">
				        <input type="password" name="password">
				        <input type="button" name="password-btn" value="Відправити">
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
		var result = '';

		// fill array with empty items to achive same items count.
		var maxQuestionsInTheme = Math.max( ...prices.map(item => item.length) );
		prices = prices.map(priceList => {
			while (priceList.length < maxQuestionsInTheme)
				priceList.push('');
			return priceList;
		})

		for (var i = 0; i < themes.length; i++) {
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
								${item}
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
	}

	disableAnswerButton()
	{
		$('.game-answer-btn').prop('disabled', true);
	}

	showProcessText(text)
	{
		$('.process-text').text(text);
	}

	getProcessText()
	{
		return $('.process-text').text();
	}

	showPregameInfo(authorList, time)
	{
		$('.lobby-info-container').text('Aвторы: ' + authorList.join(', '));
		$('.lobby-info-container').show();
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
		$('.lobby-info-container').text('Hазвание: ' + title);
		$('.lobby-info-container').show();

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
			}, 10)
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
			<div class="question-process-text">Отвечающте игроки: </div>
			${clients_html}
		</div>`

		$('.lobby-game-container').html(html);
	}

	inputTextPopup(time)
	{
		let el = document.createElement('div');
		return new Promise((resolve, reject) => {
			$(el).addClass('input-text-popup');
			$(el).html(`
				<input type="text" name="text"/>
				<button class="input-text-popup-btn">Ok</button>
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

			$('.wrapper').append(el);
		})
		.then((text) => {
			$(el).remove()
			return text;
		})
	}
}