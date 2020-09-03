<?
/**
 * 
 */
class gameController
{
	
	public function actionView()
	{
		require ROOT."/view/game/index.php";
	}

	public function actionCreate()
	{
		require ROOT."/view/game/create.php";
	}
}

?>