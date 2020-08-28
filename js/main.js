

let clickEventer = new Eventer();

let wrapper = $("div.wrapper");

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

function ChangePage (page_path) {   //    page changer function

  Change = function(page)
  {
    document.body.innerHTML = page

    history.pushState(null,null, page_path)
  };

  return XMLRequest(page_path, null);
};

clickEventer.addEvent("a",(event) =>{

	let link = $(event.target).attr("href").trim();

	ChangePage(link).
    then( response => {
		
        let ar = $.parseHTML(response);

        $(ar).each((i,item) => {
            let el = $(item);

            if(el.is("div.wrapper"))
            {
                
                wrapper.html(el.html());
            }
        })

    })

    return false;
})

$(document).bind("click",(event) => {
	return clickEventer.checkAndRun(event.target,event);
})

console.log($("div"));