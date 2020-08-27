

let clickEventer = new Eventer();

clickEventer.addEvent("a",(event) =>{

	alert("click");

	return false;
})

$(document).bind("click",(event) => {
	return clickEventer.checkAndRun(event.target,event);
})