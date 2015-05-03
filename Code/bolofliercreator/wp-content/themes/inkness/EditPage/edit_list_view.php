<?php
class edit_list_view
{
    private $model;
    private $controller;
 
    public function __construct() {
    	get_header(); 	
    } 
	
	/*
	 * displays all the bolos the current user can edit
	 * @param $result a mysqli_result object containing the data to be displayed
	 */
	public function bolos_for_edit($result){
			
		echo '<style>';
			echo 'th, td {
			 		padding: 10px;
			 		max-height: 10px;
			}';
			echo 'a img {
					display:none; }';
			echo 'a:hover img {
					display:block;
					position: absolute;					
					max-width: 250px; 
					max-height: 300px;
				}';
		echo '</style>';
					
		echo '<div class="container">';
			echo '<table style="width:60%">';
				echo '<tr>';
					echo '<th>BOLO ID</th>';
				    echo '<th>Category</th>'; 
				    echo '<th>Date</th>';
					echo '<th>Pic</th>';
					echo '<th></th>';
					echo '<th></th>';
				echo '</tr>';
				while($row = $result->fetch_assoc()){
					echo '<tr>';	
						$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];				
						echo '<td>' . $row['bolo_id'] . '</td>';
						echo '<td>' . $row['selectcat'] . '</td>';
						echo '<td>' . $row['datecreated'] . '</td>';						
						echo '<td><a href="#">View Image<img src="'.$img.'" /></a></td>';						
						echo '<td> <a href="?page_id=1502&idBolo=' . $row['bolo_id'] . '">Edit</a></td>';
						echo '<td> <a href="?page_id=1532&idBolo=' . $row['bolo_id'] . '">Archive</a></td>';						
					echo '</tr>';
				}
			echo "</table>";
		echo '</div>';
		
		get_footer();
	}//end bolos_for_edit
}

?>