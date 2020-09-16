<?
class FuncHelper{
	public static function random_string($length_of_string) {
    	return substr( md5( time() ), 0, $length_of_string );
	}
}



// XMLHttpsRequest
//-------------
/*
XMLRequest(path, message){

 	return new Promise((resolve, reject) => {

      	var xhr = new XMLHttpRequest();

     	xhr.open('POST', path, true);

	  	xhr.onload = function(){

			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			}
			else {
				reject(xhr.statusText);
			}

	  	};

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send( message );

  })
}
*/
// -------
?>