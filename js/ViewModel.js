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

}