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

		console.log(prices);
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
}