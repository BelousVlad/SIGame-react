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

function viewLoader()
{
    $("wrapper").addClass("dnone");
    $(".main-loader").addClass("active");
    $(".main-loader").removeClass("unactive");
}

function hideLoader()
{
    $("wrapper").removeClass("dnone");
    $(".main-loader").addClass("unactive");
    $(".main-loader").removeClass("active");
}

let socket;

function openSocket()
{
    let socket = new WebSocket('ws://sigame:8640');

    socket.binaryType = "arraybuffer";

    socket.onopen = function (event) {
        hideLoader();
    };  

    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    socket.onclose = function(event)
    {
        viewLoader();
        socket = openSocket();
    }
}


socket = openSocket();