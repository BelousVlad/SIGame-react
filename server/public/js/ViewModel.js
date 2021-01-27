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

}