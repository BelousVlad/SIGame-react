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


clickEventer.addEvent("a",(event) =>{

	let link = $(event.target).attr("href").trim();

  pager.changePage(link);

  return false;
})



$(document).bind("click",(event) => {
	return clickEventer.checkAndRun(event.target,event);
})

window.onpopstate = function() {
  pager.changePage(document.URL,false)
}

const socket = new WebSocket('ws://sigame:8640');

socket.binaryType = "blob";

socket.addEventListener('open', function (event) {
  
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

socket.onerror = function(event)
{
  console.log(event);
  console.log(event.message);
}