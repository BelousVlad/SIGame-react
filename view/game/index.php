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
			
		</div>
	</div>
</section>
<script>

function getLobbies (){

XMLRequest("../../index.php", "GetLobbyList=1").
then( (result) => {
	let arr = JSON.parse(result);
	arr.reduce(item => {
		
	})
})



</script>

<?
include ROOT.'\view\footer.php';
?>