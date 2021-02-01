class ViewModel {
	constructor()
	{

	}

	viewLoader()
	{
	    $("wrapper").addClass("dnone");
	    $(".main-loader").addClass("active");
	    $(".main-loader").removeClass("unactive");
	}

	hideLoader()
	{
	    $("wrapper").removeClass("dnone");
	    $(".main-loader").addClass("unactive");
	    $(".main-loader").removeClass("active");
	}

	viewLobbies(arr, dblclickhandler)
	{
		let lob_html = arr.reduce((t,item) =>
			t +
			`<div class="lobby-list-item" title='${item.title}' is_password="${item.is_password}">
				<div class="lobby-list-item-title">${item.title}</div>
				<div class="lobby-list-item-players-count">
					${item.players_count}/${item.max_players}
				</div>
			</div>`
		,"");

		$(".lobby-list").html(lob_html);

		$('.lobby-list-item').dblclick(dblclickhandler)
	}

	viewPlayers(players, is_host)
	{

		let host_menu = `
			<div class="host-player-menu">
				<div class="host-player-menu-change-score">Изменить очки</div>
				<div class="host-player-menu-kick">Выгнать</div>
			</div>
		`

		let html = players.reduce((t,item) =>
			t + `
			<div class="player-box" name="${item.name}">
				${ is_host ? host_menu : '' }
				<img class="player-box-img">
				<div class="player-box-name">${item.name}</div>
				<div class="player-box-score">${item.score}</div>
			</div>
			`
		,"");


		$(".players-container").html(html);

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

	viewChangeScorePopup()
	{
		return new Promise((resolve, reject) => {
			let element = $(`
				<div class="popup-bg">
				    <div class="container popup-container">
				        <input type="number" name="score">
				        <input type="button" name="score-btn" value="Зміyнити">
				    </div>
				</div>
			`)
			$(element).find('.popup-container').click(function(e){
				return false;
			});
			$(element).find('input[name=score-btn]').click(function(e){
				let score = $(element).find('input[name=score]').val().trim();

				resolve({score, element})
			})

			$(element).click(function(e){
				$(this).remove();
				reject(element)
			})

			$('.wrapper').append(element)
		})
	}

	showRound( round ) {

		let html = round.themes[0].theme.reduce( (acc, item) =>
			acc +=
			`
			<div class="question-table-line">
				<div class="theme">
					${ item.$.name }
				</div>
				<div class="question-line">
					${ item.questions[0].question.reduce( (acc, item) =>
						acc +=
						`
						<div class="singe-question">
							${ item.$.price }
						</div>
						`,
						""
					) }
				</div>
			</div>
			`,
			""
		)


		$('.main-canvas').html( html );
		console.log( round, html, 123);
	}
	addChatMessage(message)
	{
		$('.chat').append(`
			<div class="chat-message">
				<span class="chat-message-from">${message.from}</span>
				<span>: </span>
				<span class="chat-message-text">${message.text}</span>
			</div>
		`)
	}

	displayError( err ) {
		console.log('-----\n'.repeat(3), err );
	}

}