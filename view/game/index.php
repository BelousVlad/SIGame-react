<?
include ROOT.'\view\header.php';
?>
<h1>GAME PAGEtest</h1>
<a href = "../record">go to records page|</a>
<a href="http://test123.com/">go to main page</a>
<input type="button" name="create game" value="create game"/>
<input type="button" name="GetLobbyList" value="getlobbylist"/>
<section>
	<div class="container">
		<div class="lobby-list-container">
			<? foreach ($lobbies as $key => $lobby): ?>

				<div class="lobby-list-item"><? echo $lobby['title']; ?></div>

			<? endforeach; ?>
		</div>
	</div>
</section>


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