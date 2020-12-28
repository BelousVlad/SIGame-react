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

	viewLobbies(arr)
	{
		let lob_html = arr.reduce((t,item) =>
			t + `<div class="lobby-list-item">${item.title}</div>`
		,"");

		$(".lobby-list-container").html(lob_html);
	}

}