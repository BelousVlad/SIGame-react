

    XMLRequest = function(path, message, callback){ /*   ofc this function          */
                                                    /*    JUST                      */
      var xhr = new XMLHttpRequest();               /*     send XMLHttpRequest      */
                                                    /*  and get response            */
      xhr.open('POST', path );

      if (typeof( callback ) !== 'undefined')
      {
        xhr.onload = function(){callback(xhr.response);};
      }

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send( message );

    };

    //XMLRequest('records/', "fname=Henry&lname=Ford", function(e){alert(e)});
