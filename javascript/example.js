

    XMLRequest = function(path, message, callback){ /*   ofc this function          */
                                                    /*    JUST                      */
      var xhr = new XMLHttpRequest();               /*     send XMLHttpRequest      */
                                                    /*  and get response            */
      xhr.open('POST', path );

      if (typeof( callback ) === typeof (function(){} ) )
      {
        xhr.onload = function(){callback(xhr.response);};
      }

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send( message );

    };

    //XMLRequest('records/', "fname=Henry&lname=Ford", function(e){alert(e)});

    ChangePage = function(page_path){   //    page changer function

      Change = function(page){
        document.body.innerHTML = page

        history.pushState(null,null, page_path)
      };

      XMLRequest(page_path, null, Change);


    };
    //window.onload = function(){alert('loaded')};
//    window.location.replace('records/')

   window.addEventListener('popstate', function (event) {
    alert("url are changed")
    });

