

    XMLRequest = function(path, message, callback){

      var xhr = new XMLHttpRequest();

      xhr.open('POST', path );

      xhr.onload = function(){callback(xhr.response);};


      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send( message );

    };

    //XMLRequest('records/', "fname=Henry&lname=Ford", function(e){alert(e)});
