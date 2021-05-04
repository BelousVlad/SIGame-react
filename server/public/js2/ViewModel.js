class ViewModel {
	constructor()
	{
		
	}

	showLobbyList(arr)
	{
		console.log(arr);
		let html = arr.reduce((sum,item) =>
			sum +
			`<div class="lobby-list-item" title='${item.title}' is_password="${item.is_password}">
				<div class="lobby-list-item-title">${item.title}</div>
				<div class="lobby-list-item-players-count">
					${item.players_count}/${item.max_players}
				</div>
			</div>`
		,"");

		$(".lobby-list").html(html);
	}
}