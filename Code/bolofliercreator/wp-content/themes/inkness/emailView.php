<?php
class Email_View{
	public function _construct(){		
	}//end constructor
	
	public function display_view($result){
		//$result = $row->fetch_assoc();
				$id = $result['bolo_id']; 
								
				$path= ' <a href="http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=' . "$id" . '"> See BOLO Details</a>';
									
			return $path;				
	
	}
	
				
		}



		
	?>