<?php
class home_view{
	public function _construct(){		
	}//end constructor
	
	/**
	 * method to draw the the homepage view: thumbnails, dropdown box and buttons needed
	 * @param $result a mysqli_result object containing the information of the bolos to displayed
	 * @param $agencies a mysqli_result object containing the information of the agencies enroled in the system
	 * @param $current_agency a string with the name of the agency by which the bolos are filtered
	 * @param $offset for the current offset
	 */
	public function update_view($result, $agencies, $current_agency, $offset){
		get_header();
		$flag=true;
		?>
		<!DOCTYPE html>
		<html>
		<body>
		
		<div class="container">
			<div class="col-md-11">				
				<div align="right">
					<!-- Dropdown menu with all the agencies -->
					<form action="" method="POST" enctype="multipart/form-data">
						<select id="agency" name="agency" style="width:160px;" class="form-control";>
								<option></option>
			                    <option>Show All</option >
			                    <?php                    
			                    while ($row = $agencies->fetch_assoc()){
			                        $prop1 = $row['name'];
			                        echo "<option>$prop1</option>";
			                        echo($prop1);
			                    }                     
			                	?>    
			           </select>
			          </div>
			         </div>
			           <div class="col-md-1">
			            	<button id="submit" name="submit" align="right">Go</button>			            	
		           </form>
	            </div>
	           
        <?php        
				//creates 6 rows to be containers for 4 thumbnails each
				for($r=0; $r<6; $r++){
					echo '<div class="horizontal">';
						//draws 4 thumbnails in the current row
						for($x=0; $x<4; $x++){
							$row = $result->fetch_assoc();
							$id = $row['bolo_id'];							
							if($id != ''){								
								echo '<div class="thumbnail">';								
									echo '<p style="font-weight:bold;" class="alignleft">'.$row['selectcat'].'</p>';
									echo '<p class="alignright">'.$row['agency'].'</p>';
									$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
									echo '<img style="height: 200px" src="'.$img.'">' . '<br />';
									echo $id . '<br />';
									echo $row['datecreated'];
									echo "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
									//echo ' <a href="/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=' . "$id" . '">
									//	Details</a>';	
									echo ' <a href="?page_id=1488&idBolo=' . "$id" . '">Details</a>';																	
								echo '</div>'; //end of individual thumbnail		
							}
							else {
								$flag=false;
								echo '</div>';
								break 2;
							}
						}
					echo '</div>';
				}
			?>
				<br>
				<!-- Prev Button -->
				<div class="col-md-5">
					<div align="right">
						<form action="" method="POST" enctype="multipart/form-data">
							<input type="hidden" id="offset" name="offset" value="<?php echo $offset-24; ?>"></input>
							<input type="hidden" id="agency" name="agency" value="<?php echo $current_agency ?>"></input>
							<?php
							if($offset!==0)
								echo '<button id="prev" name="prev">Prev</button>';
							?>
						</form>
					</div>
				</div>
				<!-- Bolo numbers -->
				<div class="col-md-2">
					<div align="center">
						<?php echo $offset+1;
							echo " ... ";
							echo $offset+24; ?>	
					</div>					
				</div>
				<!-- Next Button -->
				<div class="col-md-5">			
					<div align="left">		
						<form action="" method="POST" enctype="multipart/form-data">
							<input type="hidden" id="offset" name="offset" value="<?php echo $offset+24; ?>"></input>
							<input type="hidden" id="agency" name="agency" value="<?php echo $current_agency ?>"></input>
							<?php
							if($flag==true){
								echo ' <button id="next" name="next">Next</button> ';
							}							
							?>
						</form>
					</div>
				</div>
			
			
			<?php
			echo '</div>';//end class=container
		
		echo '</html>';
		echo "</body>";
		
		get_footer();
	}//end uptade_view
}//end class
?>