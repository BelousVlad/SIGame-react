class Pager{
	constructor(XMLRequest)
	{
		this.history = [];
		this.XMLRequest = XMLRequest;
		this.history.push(document.URL);
	}

	changePage(page_path, isChangeHistory)
	{
		isChangeHistory = isChangeHistory === undefined || isChangeHistory === null

		if (isChangeHistory)
			window.history.pushState(null,null, page_path);
		this.history.push(document.URL);


		return XMLRequest(page_path,null).
		then((resolve,reject) => {
			let ar = $.parseHTML(resolve);

			$(ar).each((i,item) => {

				let el = $(item);

				if(el.is("div.wrapper"))
				{
					wrapper.html(el.html());
				}

			})
		});
	}



}