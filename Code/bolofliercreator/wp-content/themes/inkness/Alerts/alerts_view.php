<?php
/**
 * Template Name: Alerts View Page
 *
 * @package Inkness
 * 
 * ?page_id=1561 
 */
?>


<?php 
	get_header();
?>

<?php
include 'alerts_control.php';
$control = new alert_control();
$alert = $control->get_info();
?>

	
 <?php
 
     include_once('/../New Agency/new_agency_control.php');
	 $controlo = new agency_control();
	 $result = $controlo->get_agencies();
 ?>
 
 <style>
	th, td {
	 		padding: 10px;
	 		max-height: 10px;
			}
</style>
<div class="container">
	<table style="width:70%">
		<tr>
			<th>Name</th>
		    <th>Address</th>
		    <th>City</th>
			<th>Zip</th>
			<th>State</th>
			<th>Phone</th>
		</tr>
		<?php
		while($row = $result->fetch_assoc()){
			echo '<tr>';			
			echo '<td>' . $row['name'] . '</td>';
			echo '<td>' . $row['st_address'] . '</td>';
			echo '<td>' . $row['city'] . '</td>';						
			echo '<td>' . $row['zip'] . '</td>';
			echo '<td>FL</td>';
			echo '<td>' . $row['phone'] . '</td>';
			//echo '<td> <a href="?page_id=1585&idAgency=' . $row['id'] . '">Edit</a></td>';
			echo '</tr>';
		}
		?>



		
		
<div class="container">
	<div class="row">
		<div class="col-md-9">
			<div class="form-group">
				<form action="<?php echo get_template_directory_uri();?>/Alerts/alerts_control.php?function=update" method="POST" enctype="multipart/form-data">
					<input type="hidden" id="user_id" name="user_id" value="<?php echo get_current_user_id() ?>"> </input>
					<div class="control-group">
						<div class="col-md-9">
							<label class="control-label" for="alert">Do you want to receive email notifications when a new BOLO is created</label>
							<div class="controls">
								<label class="checkbox-inline"></label>
								<?php //to mark the radio button with the value on the database: if the database says "reliable" the reliable button will be marked
								if(stripos($alert,"true") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "alert[]" value ="TRUE" ' .'checked' . '>YES</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "alert[]" value ="FALSE">NO</label> ';									
								}
								if(stripos($alert,"false") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "alert[]" value ="TRUE">YES</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "alert[]" value ="FALSE" ' .'checked' . '>NO</label> ';										
								}								
								?>
								<label class="checkbox-inline"><input type="hidden" name= "alert[]" value =""</label>  
							</div>
						</div>
					</div>
					<!-- Save Button -->
					<div class="control-group">
						<div class="col-md-9">
							<br/>
							<button  id="submit" name="submit" align = "right">Save</button>
							<br/>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>						

<?php get_footer();?>
