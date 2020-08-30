<? include ROOT.'/view/header.php' ?>





<h1> GAME CREATE PAGE</h1>

<a href="../../"> back to main page</a>
<br/>

<input type="input" name="title" value="some_title" id="title"/>
<input type="input" name="password" value="password" id="password"/>
<input type="input" name="max_size" value="5" id="max_size"/>
<input type="input" name="rules" value="rules" id="rules"/>
<input type="input" name="pack" value="pack" id="path"/>
<input type="button" name="send" value="send" id="title"/>




<script type="text/javascript">
	document.getElementsByName('send')[0].onclick = () =>{

	console.log("start of request");

	let message = "&title=" + document.querySelector('#title').value + "&password=123&max_size=5&path=gg.pdf";

	(new XMLRequest("../../index.php", "CreateLobby=1" + message)).then(

	(res) => {
		console.log(res);
	}
	)
	}




</script>




<? include ROOT.'/view/footer.php '?>