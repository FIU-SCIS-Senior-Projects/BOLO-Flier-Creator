<?php
class view{
	
	public function _construct(){
		
	}
	
	//draws the fields for badge and agency in the user profile page
	public function profile_fields($user, $result){
		?>
		<table class="form-table">
			<!-- Badge Field -->
			<tr>
				<th><label for="badge">Badge</label></th>
				<td>
					<input type="text" name="badge" id="badge" 
					value="<?php echo esc_attr( get_the_author_meta( 'badge', $user->ID ) ); ?>
						"class="regular-text" /><br />
					<span class="description">Enter the badge number.</span>
				</td>
			</tr>
			<!-- Agency Dropbox -->
			<tr>
				<th><label for="agency">Agency</label></th>
				<td>
					<select id="agency" name="agency" style="width:200px;" class="form-control" >
	                    <option>  </option >
	                    <?php                    
	                    while ($row= mysqli_fetch_array($result))  {
	                        $prop1 = $row['name'];
	                        echo "<option > $prop1 </option >";
	                        echo($prop1);
	                    }                    
	                    ?>
	                </select>
					<span class="description"> Current Agency: 
						<?php echo esc_attr( get_the_author_meta( 'agency', $user->ID ) ); ?></span>
				</td>
			</tr>
		</table>
	<?php
	}
}
?>