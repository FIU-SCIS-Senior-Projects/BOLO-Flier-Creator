 <?php
/**
 * Template Name: Editor View
 *
 * @package Inkness
 */
 ?>
 <?php // page 1502 ?>

<?php get_header();?>

<?php
include_once("editor_controller.php");

$control = new editor_controller();
$row = $control->get_bolo($_GET['idBolo']);
?>

<div class="container">
	<div class="row">
		<div class="col-md-9">
			<div class="form-group">
				<form action="<?php echo get_template_directory_uri();?>/EditPage/editor_controller.php?function=update" method="POST" enctype="multipart/form-data">
					
					<div class="controls">
						<div class="col-md-6">
							<label class="control-label">BOLO ID: </label> <?php echo $row['bolo_id'] ?> </p>
							<label class="control-label">Agency: </label> <?php echo $row['agency'] ?> Police Department</p>
							<input type="hidden" id="bolo_id" name="bolo_id" value="<?php echo $row['bolo_id'] ?>"> </input>							
							<input type="hidden" id="editor_id" name="editor_id" value="<?php echo get_current_user_id() ?>"> </input>
							<!-- Update Field -->
							<label class="control-label" for="race">Update</label>
							<div class="controls">
								<select id="update" name="update" class="input-xlarge">
									<option value =""></option>
									<option selected="selected"><?php echo $row['update_status'] ?></option>
									<option>CANCELED</option>
									<option>IN CUSTODY</option>
									<option>LOCATED</option>									
								</select>
							</div> 							
							<!-- Category Field -->
							<label class="control-label" for="selectbasic">Category</label>
							<br />
							<select id="selectcat" name="selectcat" class="input-xlarge">
								<option value =""></option>
								<option selected="selected"><?php echo $row['selectcat'] ?></option>
								<option>ARSON</option>
								<option>BURGLARY</option>
								<option>DOMESTIC SECURITY</option>
								<option>ESCAPE</option>
								<option>FRAUD</option>
								<option>HOME INVASION</option>
								<option>HOMICIDE</option>
								<option>MISSING JUVENILE</option>
								<option>MISSING PERSON</option>
								<option>NARCOTICS</option>
								<option>NEED TO IDENTIFY</option>
								<option>OFFICER SAFETY</option>
								<option>PC TO ARREST</option>
								<option>ROBBERY</option>
								<option>RUNAWAY</option>
								<option>SEX OFFENSE</option>
								<option>SITUATIONAL AWARENESS</option>
								<option>THEFT - AUTO</option>
								<option>THEFT - BOAT</option>
								<option>THEFT - GRAND</option>
								<option>THEFT - PETIT</option>
								<option>WANTED</option>
							</select>
							<!-- Name Field--><br>
							<label class="control-label" for="myName">Name</label>
							<div class="controls">
								<input id="name" value="<?php echo $row['myName'] ?>" name="myName" placeholder="" class="input-xlarge" type="text">
							</div>
							<!-- Last Name Field-->
							<label class="control-label" for="lastName">Last Name</label>
							<div class="controls">
								<input id="lastName" value="<?php echo $row['lastName'] ?>" name="lastName" placeholder="" class="input-xlarge" type="text">
							</div>
							<!-- Date of Birth Field-->
							<label class="control-label" for="dob">D.O.B.</label>
							<div class="controls">
								<input id="dob" value="<?php echo $row['dob'] ?>" name="dob" placeholder="YYYY/MM/DD" class="input-xlarge" >
							</div>
							<!-- Drivers License Field-->
							<label class="control-label" for="DLnumber">DL Number</label>
							<div class="controls">
								<input id="DLnumber" value="<?php echo $row['license'] ?>" name="DLnumber" placeholder="" class="input-xlarge" type="text">
							</div>
							<!-- Race Field -->
							<label class="control-label" for="race">Race</label>
							<div class="controls">
								<select id="race" name="race" class="input-xlarge">
									<option value =""></option>
									<option selected="selected"><?php echo $row['race'] ?></option>
									<option>Hispanic</option>
									<option>White</option>
									<option>Asian</option>
									<option>Black or African American</option>
									<option>America Indian or Alaska Native</option>
									<option>Native Hawaiian or Other Pacific Islander</option>
								</select>
							</div>
							<!-- Sex Field -->
							<label class="control-label" for="sex">Sex</label>
							<div class="controls">
								<select id="sex" name="sex" class="input-xlarge">
									<option value =""></option>
									<option selected="selected"><?php echo $row['sex'] ?></option>
									<option>Male</option>
									<option>Female</option>
								</select>
							</div>
							<!-- Height Field -->
							<label class="control-label" for="height">Height</label>
							<div class="controls">
								<input id="height" value="<?php echo $row['height'] ?>" name="height" placeholder="" class="input-xlarge" type="text">
							</div>
						</div>
					</div>
					<!-- Upload Picture --> 
					<div class="control-group">
						<?php $img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image']; ?>
						<div class="col-md-6">
							<label class="control-label" for="picture">Current Image</label>
							<div class="controls">
								<input type="hidden" value="<?php echo $img ?>" name="MAX-FILE_SIZE" value="102400">
								<img src="<?php echo $img ?>">
								<p>Browse for new</p>
								<input type = "file" value="<?php echo $img ?>" name="picture" id="picture" accept="image/*"/> 
							</div>
						</div>
					</div> 
					<!-- Weight Field-->
					<div class="control-group">
						<div class="col-md-6">
							<label class="control-label" for="weight">Weight</label>
							<div class="controls">
								<input id="weight" value="<?php echo $row['weight'] ?>" name="weight" placeholder="" class="input-xlarge" type="text">
							</div>						
						</div>
					</div>					
					<!-- Hair Field -->
					<div class="control-group">
						<div class="col-md-6">
							<label class="control-label" for="haircolor">Hair Color</label>
							<div class="controls">
								<select id="haircolor" name="haircolor" class="input-xlarge">
									<option value =""></option>
									<option selected="selected"><?php echo $row['haircolor'] ?></option>
									<option>Black</option>
									<option>Blonde</option>
									<option>Red</option>
									<option>Brown</option>
									<option>Gray</option>
									<option>White</option>
									<option>Sandy</option>
									<option>Bald (No hair)</option>
								</select>
							</div>
						</div>
					</div>
					<!-- Tattoo Field -->
					<div class="control-group">
						<div class="col-md-6">
							<label class="control-label" for="tattoos">Tattoos/Scars</label>
							<div class="controls">
								<input id="tattoos" value="<?php echo $row['tattoos'] ?>" name="tattoos" placeholder="" class="input-xlarge" type="text">
							</div>							
						</div>						
					</div>
					<!-- Address Field -->
					<div class="control-group">
						<div class="col-md-6">
							<label class="control-label" for="address">Address</label>
							<div class="controls">
								<input id="address" value="<?php echo $row['address']?>" name="address" placeholder="" class="input-xlarge" type="text">
							</div>
						</div>
					</div>
					
					<div class="control-group">
						<div class="col-md-6">
							<label class="control-label" for="link">Video Link</label>
							<div class="controls">
								<input id="link" value="<?php echo $row['link']?>" name="link" placeholder="" class="input-xlarge" type="text">
							</div>
						</div>
					</div>
					
					
					<!-- Additional Info Field -->
					<div class="control-group">
						<div class="col-md-9">
							<br />
							<label class="control-label" for="adtnl-info">Additional Info</label>
							<div class="controls">                     
								<textarea id="adtnlinfo" name="adtnlinfo" align=left><?php echo $row['adtnlinfo'];?></textarea>
							</div>
						</div>
					</div>
					<!-- Summary Field -->
					<div class="control-group">
						<div class="col-md-9">
							<label class="control-label" for="summary">Summary</label>
							<div class="controls">                     
								<textarea id="summary" name="summary"><?php echo $row['summary'];?></textarea>
							</div>
						</div>
					</div>
					<!-- Source Reliability -->
					<div class="control-group">
						<div class="col-md-9">
							<label class="control-label" for="source">Source Reliability</label>
							<div class="controls">
								<label class="checkbox-inline"></label>
								<?php //to mark the radio button with the value on the database: if the database says "reliable" the reliable button will be marked
								if(strpos($row['reliability'],"Reliable") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Reliable" ' .'checked' . '>Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Usually Reliable">Usually Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unreliable">Unreliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unknown">Unknown</label> ';
								}
								elseif(strpos($row['reliability'],"Usually Reliable") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Reliable">Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Usually Reliable" ' .'checked' . '>Usually Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unreliable">Unreliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unknown">Unknown</label> ';
								}
								elseif(strpos($row['reliability'],"Unreliable") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Reliable">Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Usually Reliable">Usually Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unreliable" ' .'checked' . '>Unreliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unknown">Unknown</label> ';
								}
								elseif(strpos($row['reliability'],"Unknown") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Reliable">Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Usually Reliable">Usually Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unreliable">Unreliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unknown" ' .'checked' . '>Unknown</label> ';
								}
								else {
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Reliable">Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Usually Reliable">Usually Reliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unreliable">Unreliable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "reliability[]" value ="Unknown">Unknown</label> ';
								}
								?>
								<label class="checkbox-inline"><input type="hidden" name= "reliability[]" value =""</label>  
							</div>
						</div>
					</div>
					<!-- Content Validity -->
					<div class="control-group">
						<div class="col-md-9">
							<label class="control-label" for="content">Content Validity</label>
							<div class="controls">
								<label class="checkbox-inline"></label>
								<?php //to mark the radio button with the value on the database: if the database says "confirmed" the reliable button will be marked
								if(strpos($row['validity'],"Confirmed") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Confirmed" ' .'checked' . '>Confirmed</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Probable">Probable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Doubtful">Doubtful</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Cannot be determined">Cannot be determined</label> ';
								}
								elseif(strpos($row['validity'],"Probable") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Confirmed">Confirmed</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Probable" ' .'checked' . '>Probable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Doubtful">Doubtful</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Cannot be determined">Cannot be determined</label> ';
								}
								elseif(strpos($row['validity'],"Doubtful") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Confirmed">Confirmed</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Probable">Probable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Doubtful" ' .'checked' . '>Doubtful</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Cannot be determined">Cannot be determined</label> ';
								}
								elseif(strpos($row['validity'],"Cannot") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Confirmed">Confirmed</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Probable">Probable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Doubtful">Doubtful</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Cannot be determined" ' .'checked' . '>Cannot be determined</label> ';
								}
								else{
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Confirmed">Confirmed</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Probable">Probable</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Doubtful">Doubtful</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "validity[]" value ="Cannot be determined">Cannot be determined</label> ';
								}	
								?>								
								<label class="checkbox-inline"><input type="hidden" name= "validity[]" value =" "></label>
							
							</div>
						</div>
					</div>
					<!-- Information Classification -->
					<div class="control-group">
						<div class="col-md-9">
							<label class="control-label" for="content">Information Classification</label>
							<div class="controls">							
								<label class="checkbox-inline"></label>
								<?php
								if(strpos($row['classification'],"FOUO") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="For Official Use Only (FOUO)" ' .'checked' . '> For Official Use Only (FOUO)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Law Enforcement Sensitive">Law Enforcement Sensitive</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Personal Identifier Information (PII)">Contains Personal Identifier Information (PII)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Public">Public</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)">Contains Information on US Person or a Lawful Permanent Resident (LPR)</label> ';
								}
								elseif(strpos($row['classification'],"Sensitive") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="For Official Use Only (FOUO)"> For Official Use Only (FOUO)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Law Enforcement Sensitive" ' .'checked' . '>Law Enforcement Sensitive</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Personal Identifier Information (PII)">Contains Personal Identifier Information (PII)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Public">Public</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)">Contains Information on US Person or a Lawful Permanent Resident (LPR)</label> ';
								}
								elseif(strpos($row['classification'],"PII") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="For Official Use Only (FOUO)"> For Official Use Only (FOUO)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Law Enforcement Sensitive">Law Enforcement Sensitive</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Personal Identifier Information (PII)" ' .'checked' . '>Contains Personal Identifier Information (PII)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Public">Public</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)">Contains Information on US Person or a Lawful Permanent Resident (LPR)</label> ';
								}
								elseif(strpos($row['classification'],"Public") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="For Official Use Only (FOUO)"> For Official Use Only (FOUO)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Law Enforcement Sensitive">Law Enforcement Sensitive</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Personal Identifier Information (PII)">Contains Personal Identifier Information (PII)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Public" ' .'checked' . '>Public</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)">Contains Information on US Person or a Lawful Permanent Resident (LPR)</label> ';
								}
								elseif(strpos($row['classification'],"LPR") !== false){
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="For Official Use Only (FOUO)"> For Official Use Only (FOUO)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Law Enforcement Sensitive">Law Enforcement Sensitive</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Personal Identifier Information (PII)">Contains Personal Identifier Information (PII)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Public">Public</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)" ' .'checked' . '>Contains Information on US Person or a Lawful Permanent Resident (LPR)</label> ';
								}
								else{
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="For Official Use Only (FOUO)"> For Official Use Only (FOUO)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Law Enforcement Sensitive">Law Enforcement Sensitive</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Personal Identifier Information (PII)">Contains Personal Identifier Information (PII)</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Public">Public</label> ';
									echo ' <label class="checkbox-inline"><input type="radio" name= "classification[]" value ="Contains Information on US Person or a Lawful Permanent Resident (LPR)">Contains Information on US Person or a Lawful Permanent Resident (LPR)</label> ';
								}
								?>								
								<label class="checkbox-inline"><input type="hidden" name= "classification[]" value =""></label>
							</div>
						</div>
					</div>					
					<!-- Save Button -->
					<div class="control-group">
						<div class="col-md-9">
							<br/><br/>
							<button  id="submit" name="submit"  class="btn btn-primary" align = "right">Submit</button>
						</div>
					</div>

				</form>
			</div>
		</div>
	</div>
</div>

<?php get_footer();?>
