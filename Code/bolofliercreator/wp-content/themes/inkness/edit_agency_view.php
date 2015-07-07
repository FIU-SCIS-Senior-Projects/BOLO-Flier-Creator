<?php
/**
 * Template Name: Edit Agency View Page
 *
 * @package Inkness
 */
 ?>
 <?php //page 1585?>
 
 <?php get_header();?>
 
 <?php
 
	include_once("new_agency_control.php");
	$controler = new agency_control();
	$agency = $controler->getAgency($_GET["idAgency"]);
			
 ?>
 		
 
 <!DOCTYPE html>
 <html>
 	<body>

 		<div class="container">`
 			<div class="row">
				<div class="col-md-9">
					<div class="form-group">
						<form id="agencyUpdate" action="<?php echo get_template_directory_uri();?>../edit_agency_controller.php" method="POST" enctype="multipart/form-data" name="agencyUpdate">
							<input id="id" name="id" type="hidden" value="<?php echo $_GET["idAgency"];?>">
							<div class="control">
								<div class="col-md-9">
									<!-- Agency Name Field--><br>
									<label class="control-label" for="a_name">Agency Name</label>
									<div class="controls">
										<input id="a_name" name="a_name" placeholder="" class="input-xlarge" type="text" size="30" value="<?php echo $agency["name"];?>">
									</div>
									<!-- Agency Address (Street) Field--><br>
									<label class="control-label" for="address">Address</label>
									<div class="controls">
										<input id="address" name="address" placeholder="" class="input-xlarge" type="text" size="30" value="<?php echo $agency["st_address"];?>">
									</div>
									<!-- Agency Address (City) Field--><br>
									<label class="control-label" for="city">City</label>
									<div class="controls">
										<input id="city" name="city" placeholder="" class="input-xlarge" type="text" size="30" value="<?php echo $agency["city"];?>">
									</div>
									<!-- Agency Address (Zip) Field--><br>
									<label class="control-label" for="zip">Zip Code</label>
									<div class="controls">
										<input id="zip" name="zip" placeholder="" class="input-xlarge" type="text" size="10" value="<?php echo $agency["zip"];?>">
									</div>
									<!-- Agency Phone Field--><br>
									<label class="control-label" for="phone">Phone Number</label>
									<div class="controls">
										<input id="phone" name="phone" placeholder="" class="input-xlarge" type="text" size="15" value="<?php echo $agency["phone"];?>">
									</div>
									
									<!-- Logo Upload --> 
									<div class="control-group">
										<div class="col-md-6">
											<label class="control-label" for="picture">Upload Logo</label>
											<div class="controls">
												<input type="hidden" name="MAX-FILE_SIZE" value="102400">
												<input type = "file" name="logo" id="logo" accept="image/*"/>
											</div>
									  </div>
									</div> 
									
									<!-- Shield Upload --> 
									<div class="control-group">
										<div class="col-md-6">
											<label class="control-label" for="picture">Upload Shield</label>
											<div class="controls">
												<input type="hidden" name="MAX-FILE_SIZE" value="102400">
												<input type = "file" name="shield" id="shield" accept="image/*"/>
											</div>
									  </div>
									</div> 
									
								</div>
							</div>	
							<!-- Save Button -->
							
							<div class="control-group">
								<div class="col-md-9">
									<br/><br/>
									<button  type="submit" value="save" name="save" class="btn btn-primary" align = "right">Submit</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			
 		</div> 		
 	</body>
</html> 
 <?php get_footer();?>
