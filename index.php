
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="123">

    </div>

      <input type="button" name="but1" value="but1">


    <input type="button" name="but2" value="but2">
    <input type="button" name="but3" value="but3">

    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script type="text/javascript">


        var xhr = new XMLHttpRequest();

        xhr.open('POST','../server.php');

        xhr.onload = function(){ alert(xhr.response); };


        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("fname=Henry&lname=Ford");





    </script>
  </body>
</html>
