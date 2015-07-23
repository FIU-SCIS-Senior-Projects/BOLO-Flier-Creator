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
$alert = 'alerts: ' . $control->get_info();
?>

	
 <?php
 
     include_once('/../new_agency_control.php');
	 $controlo = new agency_control();
	 $result = $controlo->get_agencies();
 ?>
 
 <style>
	th, td {
	 		padding: 10px;
	 		max-height: 10px;
			border: 1px solid;
			}
			
	.agencies-table{
		
	}
	
	.agencies-table th{
		background-color: rgb(234, 233, 231);
	}
</style>

<script>
	
	function selectAll(elem, selectedOnes){
		
		var checked = jQuery(elem).is(':checked');
		jQuery(selectedOnes).each(function(index){
			jQuery(this).prop('checked',checked);
		});
	}
	
</script>

		
<div class="container">
	
	<div class="row">
		<br/>

		<div class="col-md-9">
			<div class="form-group">
				<form action="<?php echo get_template_directory_uri();?>/Alerts/alerts_control.php?function=update" method="POST" enctype="multipart/form-data">
					<input type="hidden" id="user_id" name="user_id" value="<?php echo get_current_user_id() ?>"> </input>
					<label class="control-label" for="alert">Select the Agencies that you would like to receive notifications from.</label>
					<table class="agencies-table">
						<tr>
							<th>
								<input type="checkbox" class="select-all-header" onclick="selectAll(this, '.select-all-row')"/>
								Select All
							</th>
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
							echo '<td><input type="checkbox" name="check-' . $row['id'] . '" class="select-all-row" ';
							
							
							if(strpos($alert, '<' . $row['id'] . '>') || $alert == 'alerts: true') 
								echo 'checked'; 			
							
							echo '/> </td>';
							echo '<td>' . $row['name'] . '</td>';
							echo '<td>' . $row['st_address'] . '</td>';
							echo '<td>' . $row['city'] . '</td>';						
							echo '<td>' . $row['zip'] . '</td>';
							echo '<td>FL</td>';
							echo '<td>' . $row['phone'] . '</td>';
							echo '</tr>';
						}
						?>
					</table>
					
					<button  id="submit" name="submit">Save Notification Preferences</button>

				</form>
			</div>
		</div>
	</div>
</div>						

<?php get_footer();?>
