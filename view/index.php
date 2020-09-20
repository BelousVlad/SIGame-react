<?
include 'header.php';
?>

<div class="container">
  <div class="main-menu-container">
    <button> click </button>
    <a href="game" class="main-menu-btn main-menu-play-btn">
        Play
    </a>
     <a href="record" class="main-menu-btn main-menu-play-btn">
        Records
    </a>
     <a href="game/index.php" class="main-menu-btn main-menu-play-btn">
        Help
    </a>
     <a href="game/index.php" class="main-menu-btn main-menu-play-btn">
        About us
    </a>
     <a href="game/index.php" class="main-menu-btn main-menu-play-btn">
        Exit
    </a>
  </div>
</div>

<script>



app.fileLoader.createLoadManager( "question-pack" ).bindToElement( document.querySelector("button") );

</script>

<?

include 'footer.php';
?>

