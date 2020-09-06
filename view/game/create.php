<? include ROOT.'/view/header.php' ?>

<h1> GAME CREATE PAGE</h1>

<a href="../../"> back to main page</a>
<br/>

<input type="input" name="title" value="some_title" id="title"/>
<input type="input" name="password" value="password" id="password"/>
<input type="input" name="max_size" value="5" id="max_size"/>
<input type="input" name="rules" value="rules" id="rules"/>
<input type="file" name="get_file" value="get_file" id="get_file"/>
<div id="file_name">  </div>

<input type="submit"/>

<script type="text/javascript">

	/*
document.querySelector('#file_uploader').onchange = () => {

	document.querySelector('#file_name').innerHTML = "FILE NAME : " + document.querySelector('#file_uploader').files[0	].name
};


	document.getElementsByName('send')[0].onclick = () => {
		console.log("start of request");



		let filereader = new FileReader();
		filereader.readAsArrayBuffer(document.querySelector('#file_uploader').files[0] 
		console.log(filereader.result);

		let message = "&title=" + document.querySelector('#title').value + "&password=123&path=" + filereader.result + "&max_size=5";

		(new XMLRequest("../../index.php", "CreateLobby=1" + message)).then(
			(res) => {
				console.log(res);
			}
		)
	}
*/



let reader = new FileReader();
let fileByteArray = [];
let a;
let file;



$("input[type=submit]").click(function(event) {
		
	console.log(event);

	let title = $("input[name=title]").val();
	let max = $("input[name=max_size]").val();
	let file = $("input[type=file]").get(0).files[0];

	reader.onloadend = function (evt) {

	a = evt.target.result;

	//file = `{"action": "test", "test": "${a.split(',')[1]}"}`;

	let action = {
		"action" : "create_lobby",
		"data" : {
			"title" : title,
			"max_players" : max,
			"pack" : a.split(',')[1]
		}
	}

	console.log(action);

	socket.send(JSON.stringify(action));

	/*
    if (evt.target.readyState == FileReader.DONE) {

       arrayBuffer = evt.target.result;
       array = new Uint8Array(arrayBuffer);	
       for (let i = 0; i < array.length; i++) {
           fileByteArray.push(array[i]);
        }
    }
    */
}

	reader.readAsDataURL(file);

	//return false;
} )

</script>

<? include ROOT.'/view/footer.php '?>