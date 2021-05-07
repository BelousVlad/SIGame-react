class PlayerBannerBuilder {
	constructor()
	{
		this.html = '';
		this.is_host = false;
		this.is_master = false;
	}

	BuildHostMenu()
	{
		this.host_menu = PlayerBannerBuilder.HostMenu;
	}

	BuildMasterMenu()
	{
		this.master_menu = PlayerBannerBuilder.MasterMenu;
	}

	BuildScore(score)
	{
		this.score_html = `<div class="player-box-score">${score}</div>`;
	}

	BuildName(name)
	{
		this.name_html = `<div class="player-box-name">${name}</div>`;
	}

	BuildAvatar(src)
	{
		this.avatar_html = 
				`<div class="players-box-img-box">
					<img class="player-box-img" src="${ src }">
				</div>`
	}

	getResult()
	{
		let service = undefined;

		if (this.host_menu || this.master_menu)
		{
			service = `
				<div class="service-player-menu">
					${ this.host_menu ?? '' }
					${ this.master_menu ?? '' }
				</div>
			`
		}

		return `
			<div class="player-box">
				${ service ?? ''}
				${ this.avatar_html ?? ''}
				${ this.name_html ?? ''}
				${ this.score_html ?? ''}
			</div>
		`
	}

	static get HostMenu() {
		return  `<div class="service-player-menu-kick">Выгнать</div>`
	}
	static get MasterMenu() {
		return  `<div class="service-player-menu-change-score">Изменить очки</div>`
	}

}