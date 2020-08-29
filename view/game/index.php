<?
include ROOT.'\view\header.php';
?>
<h1>GAME PAGEtest</h1>
<a href = "../record">go to records page|</a> <br/>
<a href="http://test123.com/">go to main page</a> <br/>
<a href="../../game/create"> create game</a> <br/>
<input type="button" name="GetLobbyList" value="getlobbylist"/>
<section>
	<div class="container">
		<div class="lobby-list-container">
			 <?



			 // foreach ($lobbies as $key => $lobby): ?>

				<div class="lobby-list-item">
					<?
					// echo $lobby['title'];
					?>

				</div>

			<?
		// endforeach; ?>
		</div>
	</div>
</section>
<script type="text/javascript">
<?
// include ROOT."/js/GetLobbyList.js"
?>

</script>
<script>



GetLobbyList = function (){
console.log("start of request");
(new XMLRequest("../../index.php", "GetLobbyList=1")).then(

	(res) => {
		console.log(res);
	}
)
}

// GetLobbyList();

document.getElementsByName("GetLobbyList")[0].onclick = GetLobbyList;

</script>

<?
include ROOT.'\view\footer.php';
?>