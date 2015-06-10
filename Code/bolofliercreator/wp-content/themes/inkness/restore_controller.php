<?php

include_once("HomeMVC/Bolo_Model.php");

if($_POST['idBolo'] == "")
{
   echo("<h3>Sorry something wrong has occurred</h3>");
}
else
{
   $model = new Bolo_Model();
   $result = $model->unarchive($_POST['idBolo']);
   
   if($result)
   {
     echo("<h3>BOLO restored successfully!");
   }
   else
   {
     echo("<h3>Some DATABASE error has occurred</h3>");
   }
}

?>
