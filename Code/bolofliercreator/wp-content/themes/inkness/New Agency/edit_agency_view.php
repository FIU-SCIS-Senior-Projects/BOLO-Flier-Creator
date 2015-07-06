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
						<form action="?page_id=1510&function3=update_agency" method="POST" enctype="multipart/form-data">
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
							
							<form action="?page_id=1510&function3=update_agency" method="POST" enctype="multipart/form-data">
							<div class="control-group">
								<div class="col-md-9">
									<br/><br/>
									<button  id="submit" name="submit"  class="btn btn-primary" align = "right">Save</button>
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
