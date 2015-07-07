<?php
/**
 * Template Name: New Agency View Page
 *
 * @package Inkness
 */
 ?>
 <?php //page 1512?>
 
 <?php get_header();?>
 
 <!DOCTYPE html>
 <html>
 	<body>
 		<div class="container">
 			<div class="row">
				<div class="col-md-9">
					<div class="form-group">
						<form id="agencyCreate" action="<?php echo get_template_directory_uri();?>../new_agency_controller.php" method="POST" enctype="multipart/form-data" name="agencyCreate">
							<div class="control">
								<div class="col-md-9">
									<!-- Agency Name Field--><br>
									<label class="control-label" for="a_name">Agency Name</label>
									<div class="controls">
										<input id="a_name" name="a_name" placeholder="" class="input-xlarge" type="text" size="30">
									</div>
									<!-- Agency Address (Street) Field--><br>
									<label class="control-label" for="address">Address</label>
									<div class="controls">
										<input id="address" name="address" placeholder="" class="input-xlarge" type="text" size="30">
									</div>
									<!-- Agency Address (City) Field--><br>
									<label class="control-label" for="city">City</label>
									<div class="controls">
										<input id="city" name="city" placeholder="" class="input-xlarge" type="text" size="30">
									</div>
									<!-- Agency Address (Zip) Field--><br>
									<label class="control-label" for="zip">Zip Code</label>
									<div class="controls">
										<input id="zip" name="zip" placeholder="" class="input-xlarge" type="text" size="10">
									</div>
									<!-- Agency Phone Field--><br>
									<label class="control-label" for="phone">Phone Number</label>
									<div class="controls">
										<input id="phone" name="phone" placeholder="" class="input-xlarge" type="text" size="15">
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
