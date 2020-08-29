<?
include ROOT.'\view\header.php';
?>
<h1>GAME PAGEtest</h1>
<a href = "../records">go to records page</a>
<input type="button" name="create game" value="create game"/>
<input type="button" name="GetLobbyList" value="getlobbylist"/>


<script>

GetLobbyList = function (){
console.log("start of request");
(new XMLRequest("../../lib/Router.php", "GetLobbyList=1")).then(

	(res) => {
		console.log(res);

	}

)
}

document.getElementsByName("GetLobbyList")[0].onclick = GetLobbyList;

</script>

<?
include ROOT.'\view\footer.php';
?>