// if ( typeof (document.getElementsByName('send')[0]) !== 'undefined')

// document.getElementsByName('send')[0].onclick = () =>{

// 	console.log("start of request");

// 	let message = "&title=" + document.querySelector('#title').value + "&password=123&max_size=5&path=gg.pdf";

// 	(new XMLRequest("../../index.php", "CreateLobby=1" + message)).then(

// 	(res) => {
// 		console.log(res);
// 	}
// 	)
	// }
	//
	//
	//
	CreateLobby = () => {

	// console.log("start of request");

	let message = "&title=" + document.querySelector('#title').value + "&password=123&max_size=5&path=gg.pdf";

	(new XMLRequest("../../index.php", "CreateLobby=1" + message)).then(

	(res) => {
		console.log(res);
	}
	)
	}



	// USELESS DUMP