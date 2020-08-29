function XMLRequest(path, message){ 
  
  return new Promise((resolve, reject) => {

      var xhr = new XMLHttpRequest();
                                                    
      xhr.open('POST', path, true);

	  xhr.onload = function(){
    	 if (xhr.status >= 200 && xhr.status < 300) {
             resolve(xhr.response);
         } else {
             reject(xhr.statusText);
         }
	  };

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send( message );

  })
};

let clickEventer = new Eventer();
let pager = new Pager(XMLRequest);

let wrapper = $("div.wrapper");



clickEventer.addEvent("a",(event) =>{

	let link = $(event.target).attr("href").trim();

  pager.changePage(link);

  return false;
})



$(document).bind("click",(event) => {
  //return false;
	return clickEventer.checkAndRun(event.target,event);
})

window.onpopstate = function() {
  pager.changePage(document.URL,false)
}