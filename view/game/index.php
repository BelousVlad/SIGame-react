<?
include ROOT.'\view\header.php';
?>
<h1>GAME PAGEtest</h1>
<a href = "../record">go to records page|</a> <br/>
<a href="http://sigame/">go to main page</a> <br/>
<a href="../../game/create"> create game</a> <br/>
<input type="button" name="GetLobbyList" value="getlobbylist"/>
<section>
	<div class="container">
		<div class="lobbies-list-refresh-btn"></div>
		<div class="lobby-list-container">

		</div>
	</div>
</section>
<script>

function getLobbies (){
	return XMLRequest("../../index.php", "GetLobbyList=1");
}

function refresh_lobbies()
{
	
}

//refresh_lobbies();

$(".lobbies-list-refresh-btn").click((event) => {
		app.refreshLobbies();
	}
)


</script>

<?
include ROOT.'\view\footer.php';
?>