<?php
class Flier_View{
	public function _construct(){		
	}//end constructor
	
	public function display_view($result){
		//$result = $row->fetch_assoc();
				$id = $result['bolo_id']; 
				
					
		echo ' <a href="/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=' . "$id" . '"> See Details</a>';
								
						}
	
          
		}
 

		
	?>
	