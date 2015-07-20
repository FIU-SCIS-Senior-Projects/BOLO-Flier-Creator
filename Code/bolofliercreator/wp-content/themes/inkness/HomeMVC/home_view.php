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
	public function update_view($result, $data, $agencies, $current_agency, $offset){
		get_header();
		$flag=true;
		?>
		<!DOCTYPE html>
		<html>
		<script>
			
			function archiveJS(boloid)
			{
				jQuery.get("?page_id=1532&idBolo=" + boloid,function(){
					location.reload();
				});
			}
			
		</script>
		<body>
		
		<div class="container">
			<div class="col-md-11">				
				<div align="right">
					<!-- Dropdown menu with all the agencies -->
					<form action="" method="POST" enctype="multipart/form-data">
						<select id="agency" name="agency" style="width:160px;" class="form-control";>
								<option></option>
			                    <option>Show All</option >
			                    <option>Show My BOLOs</option >
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
                                    
                                    //if the BOLO has been updated, display an Update notification
                                    $true=1;
                                    if ($row['recently_updated']==$true)
                                    {
                                        echo '<font color="red">UPDATED! on ' .$row['edit_date'] . '</font> <br />';
                                    }
                                    else {
                                    	echo $row['datecreated'] . '<br />';
                                    }
                                    
									echo $id . '<br />';
									//echo "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
									//echo ' <a href="/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=' . "$id" . '">
									//	Details</a>';	
									echo ' <a href="?page_id=1488&idBolo=' . "$id" . '">Details</a> &nbsp&nbsp&nbsp';
                                    //Code to show edit link if appropriate below
                                    //if current user is admin, show edit on all BOLOS
                                    if(current_user_can( 'activate_plugins' )){
                                        echo ' <a href="?page_id=1502&idBolo=' . "$id" . '">Edit</a> &nbsp&nbsp&nbsp';
                                        //Archive link
                                       
                                       echo '<td> <a href="#" onclick="javascript: archiveJS(\'' . "$id" . '\')">Archive</a></td>';
                                    }
                                    //but if tier 2, show edit only on agency bolos
                                    elseif(current_user_can( 'edit_other_pages' )){
                                         $ag_name = get_user_meta(get_current_user_id(), "agency", true);
                                         if($ag_name == $row['agency'])
                                         {
                                             echo ' <a href="?page_id=1502&idBolo=' . "$id" . '">Edit</a>';
                                             //tier 2 archive link
                                             echo '<td> <a href="#" onclick="javascript: archiveJS(\'' . "$id" . '\')">Archive</a></td>';
                                         }
                                        
                                    }
                                    //other wise, it is a normal user, so check to see if they can edit
                                    else{
                                        while($dataRow = $data->fetch_assoc()){
                                            if ($dataRow['bolo_id']==$id){
                                                echo ' <a href="?page_id=1502&idBolo=' . $dataRow['bolo_id'] . '">Edit</a>';
                                                break;
                                            }
                                        }   
                                    }
                                    															
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
