<?php
/**
 * Template Name: Alerts View Page
 *
 * @package Inkness
 * 
 * ?page_id=1561 
 */
?>

<?php get_header();?>

<?php
include 'alerts_control.php';
$control = new alert_control();
$alert = $control->get_info();
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
