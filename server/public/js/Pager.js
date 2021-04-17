class Pager{
	constructor(app)
	{
		this.history = [];
		this.app = app;
		this.XMLRequest = app.speakerctrl.speaker.XMLRequest;
		this.history.push(document.URL);
			/* init events*/
		this.app.subscribe('page_change_start', function() {
			app.currentPageState = 'changing'; /* possibilities : changing , set , error */
		})
		this.app.subscribe('page_change_end', function() {
			app.currentPageState = 'set'; /* possibilities : changing , set , error */
		})
	}

	changePage(page_path, isChangeHistory)
	{
		isChangeHistory = isChangeHistory === undefined || isChangeHistory === null

		if (isChangeHistory)
			window.history.pushState(null,null, page_path);
		this.history.push(document.URL);

		app.dispatch('page_change_start', { page_path })



		return this.XMLRequest(page_path,null).
		then(function(data) {

			let ar = data;

			$(data).each((i,item) => {
				let el = $(item);

				if(el.is("div.wrapper"))
				{
					$("div.wrapper").html(el.html());
				}

			})
			this.app.dispatch('page_change_end');
		}.bind(this));
	}
	awaitChangeEnd( certain_url = undefined ) {
		return new Promise(function(resolve, reject) {
			if ( this.app.currentPageState === 'set' ) {
				typeof certain_url === 'string' && certain_url === document.URL || resolve(); /*todo change */
			}
			this.app.subscribe_once('page_change_end', () => {typeof certain_url === 'string' && certain_url === document.URL || resolve(); /*todo change */});
			setTimeout( function() {
				reject('timeout error')
			}, 1.5e4/*15 sec*/);
		}.bind(this))
	}
}