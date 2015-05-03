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
						<form action="?page_id=1510&function=save_agency" method="POST" enctype="multipart/form-data">
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
