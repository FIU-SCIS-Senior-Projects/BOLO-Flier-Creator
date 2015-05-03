<?php
/* Description: license page to manage update check licenses.
Licenses will be added by other (add-on or related) plugins via filters and call to license object */

define ('AMR_USERS_STORE_URL','http://wpusersplugin.com');

function amr_get_licenses() {

	$licenses = get_option( 'amr_licenses' );

	if( empty( $licenses ) ) $licenses = array();    //we have no licenses saved
	
	return apply_filters( 'amr_get_licenses', $licenses );  // in case new plugins where license not saved yet
}

function amr_change_license( $l, $new ) {
	$old = get_option( $l.'-license-key' );
	$done = true;
	if ( isset($old) and ($old !== $new )) {
		delete_option( $l.'-license-status' ); // new license has been entered, so must reactivate
		$done = update_option( $l.'-license-key', $new );
		if ($done) {
			amr_users_message(sprintf(__('%s -license-key updated','amr-users'),$l));
		}
		else amr_flag_error ('Error updating '.$l.'-license-key');
	}
	//else amr_users_message (sprintf(__('%s License key no change', 'amr-users'),$l));	
	return $done;
}

function amr_users_save_licenses($licenses) { // security check already done, save in DB if changed
	
		foreach ($licenses as $l => $n) {
			$license = '';
			if (isset($_POST['key']) and is_array($_POST['key']) ) {
				if (!empty($_POST['key'][$l])) {		
					$license = sanitize_key($_POST['key'][$l]);					
				}
			}
			amr_change_license($l, $license);		// delete when empty
		}
		//else amr_flag_error ('Error processing license key updates','amr-users');		
}

function amr_users_activate_licenses($licenses) {

		if ( ! isset( $_POST['activate'] ) and !is_array($_POST['activate']) ) {
			return;
		}

		foreach( $_POST['activate'] as $l => $activate ) { // will only do one at a time really
			
			if (empty($_POST['key']) or  (empty($_POST['key'][$l]))) {
				amr_flag_error(sprintf(__('No license key entered for %s', 'amr-users'), $l));
				continue; // we havent got this key
			}
			$license_key = sanitize_text_field( $_POST['key'][$l] );

			// Data to send to the API
			$api_params = array(
				'edd_action' => 'activate_license',
				'license'    => $license_key,
				'item_name'  => urlencode( $licenses[$l] ),
				'url'        => home_url()
			);
			
			// Call the API
			$response = wp_remote_post(
				AMR_USERS_STORE_URL,
				array(
					'timeout'   => 15,
					'sslverify' => false,
					'body'      => $api_params
				)
			);

			// Make sure there are no errors
			if ( is_wp_error( $response ) or empty($response['body']) ) {
				amr_flag_error(__('Error activating', 'amr-users'));
				echo '<pre>';print_r($response['response']);
				print_r($response['body']); echo '</pre>';
				return;
			}

			// Decode license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );
			if (!empty($license_data->success) and $license_data->success) {	
				update_option( $l . '-license-status', $license_data->license );
				// Tell WordPress to look for updates
				set_site_transient( 'update_plugins', null );			
				amr_users_message(sprintf(__('%s activated','amr-users'),$l));
			}
			else {
				amr_flag_error(__('Error activating with that license key', 'amr-users')
				.' '.print_r($response['body'], true				));
				
			}
		}
}	

function amr_users_deactivate_license($licenses) {

		if ( ! isset( $_POST['deactivate'] ) and !is_array($_POST['deactivate']) ) {
			return;
		}

		foreach( $_POST['deactivate'] as $l => $activate ) { // will only do one at a time really
			if (empty($_POST['key'])) continue;  // we got no keys
			if (empty($_POST['key'][$l])) continue; // we havent got this key
			
			$license_key = sanitize_text_field( $_POST['key'][$l] );

			// Data to send to the API
			$api_params = array(
				'edd_action' => 'deactivate_license',
				'license'    => $license_key,
				'item_name'  => urlencode( $licenses[$l] ),
				'url'        => home_url()
			);

			// Call the API
			$response = wp_remote_post(
				AMR_USERS_STORE_URL,
				array(
					'timeout'   => 15,
					'sslverify' => false,
					'body'      => $api_params
				)
			);

			if ( is_wp_error( $response ) or empty($response['body']) ) {
				amr_flag_error(__('Error deactivating', 'amr-users'));
				echo '<pre>';print_r($response['response']);
				print_r($response['body']); echo '</pre>';
				return;
			}

			// Decode license data
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );
			if (!empty($license_data->license) and ($license_data->license=='deactivated')) {	
				delete_option( $l . '-license-status', $license_data->license );	
				amr_users_message(sprintf(__('%s deactivated','amr-users'),$l));
			}
			else {
				amr_flag_error(__('License expired or error deactivating with that license key', 'amr-users').' '
				.print_r($response['body'], true				));	
				//license probably expired
				delete_option( $l . '-license-status', $license_data->license );			
			}
		}
	}
	
function amr_users_get_plugin_version($id) {

	$license = trim( get_option( $id.'-license-key' ) );
		
	$api_params = array( 
		'edd_action' => 'get_version', 
		'license' => $license, 
		'item_name' => urlencode( $id ),
		'url'       => home_url()
	);

	// Call the custom API.
	$response = wp_remote_get( add_query_arg( $api_params, AMR_USERS_STORE_URL ), array( 'timeout' => 15, 'sslverify' => false ) );

	if ( is_wp_error( $response ) )
		return false;

	$license_data = json_decode( wp_remote_retrieve_body( $response ) );
	
	return $license_data;
}

function amr_users_show_version ($version_data) {
	?><table class="form-table"><caption><?php
	if (!empty($version_data->msg)) {
		echo $version_data->msg;
		?></caption><?php
		}?>
		<tbody><tr><th><?php
		_e('Latest Version','amr-users' )	;
		?></th><td><?php
	if (!empty($version_data->new_version))	{
		?><a href=" <?php 
		echo $version_data->homepage; ?>" title="<?php _e('Plugin details','amr-users'); ?> ">
		<?php
		echo $version_data->new_version; ?>	
		</a><?php
		if (!empty($version_data->download_link)) {
		?>&nbsp;<a href=" <?php 
		echo $version_data->download_link; ?>" 
		title="<?php _e('Or wait for wordpress to pick it up in the plugin update check','amr-users'); ?> ">
		<?php _e('Download','amr-users'); ?></a>
		<?php	
		}
	}
	else {
		_e('Version information not available for this license key and this site.','amr-users' );	
		_e('Verify at:','amr-users' );
		?> <a href="<?php echo AMR_USERS_STORE_URL;?>"><?php echo AMR_USERS_STORE_URL;?></a>
		<?php
		} ?>
		</td></tr></tbody></table><?php
	/* 
  public 'new_version' => string '2.12' (length=4)
  public 'name' => string 'amr users plus' (length=14)
  public 'slug' => boolean false
  public 'url' => string 'http://wpusersplugin.com/downloads/amr-users/?changelog=1' (length=62)
  public 'homepage' => string 'http://wpusersplugin.com/downloads/amr-users/' (length=50)
  public 'package' => string 'http://wpusersplugin.com/?edd_action=package_download&id=4213&key=001fe02f8ba95e799d29efedf9e80885&expires=MTQxMzg3Nzg1Nw%3D%3D' (length=127)
  public 'download_link' => string 'http://wpusersplugin.com/?edd_action=package_download&id=4213&key=001fe02f8ba95e799d29efedf9e80885&expires=MTQxMzg3Nzg1Nw%3D%3D' (length=127)
  public 'sections'
	*/
	//var_dump($version_data);	
}

function amr_users_get_license_data($l) {

	global $wp_version;

	$license = trim( get_option( $l.'-license-key' ) );
		
	$api_params = array( 
		'edd_action'=> 'check_license', 
		'license' 	=> $license, 
		'item_name' => urlencode( $l ),
		'url'       => home_url()
	);

	// Call the custom API.
	$response = wp_remote_get( 
		add_query_arg( $api_params, 
			AMR_USERS_STORE_URL ), 
			array( 'timeout' => 15, 
				'sslverify' => false ) 
			);


	if ( is_wp_error( $response ) )
		return false;

	$license_data = json_decode( wp_remote_retrieve_body( $response ) );
	if ($license_data->license == 'site_inactive') { // deactivated remotely at host site?
		delete_option( $l . '-license-status', $license_data->license );
		amr_flag_error(sprintf(__('%s at this site is inactive at remote host', 'amr-users'), $license_data->item_name));
	}
	
	return $license_data;
}

function amr_users_show_license($license_data) {
/*
		'license_limit'		=>__('Maximum sites for license','amr-users'),
		'site_count'		=>__('Sites using license key','amr-users'),
		'activations_left'	=>__('Activations left','amr-users')
*/
	if (!empty($license_data->site_count))
		$license_data->sites_limit = $license_data->site_count;
	if (!empty($license_data->license_limit)) 
		$license_data->sites_limit .= ' / '.$license_data->license_limit;
	unset ($license_data->license_limit);	
	unset ($license_data->site_count);
	unset ($license_data->activations_left);
	
	$license_fields = array (
		'license' 			=>__('Remote Status','amr-users'),
		'sites_limit'		=>__('Sites / Limit','amr-users'),
		//'item_name' 		=>__('Item name','amr-users'),
		'expires'			=>__('Expiry Date','amr-users'),
		//'payment_id'		=>__('Payment id','amr-users'),
		//'customer_name'		=>__('Customer Name','amr-users'),
		'customer_email'	=>__('Customer Email','amr-users'),

		);
	
	if (!empty($license_data)) {
	
		?><table class="widefat"><tr><?php
		foreach ($license_fields as $fld => $fldtitle) {
			echo '<th>'.$fldtitle.'</th>';
		}
		?></tr><tr><?php
		foreach ($license_fields as $fld => $fldtitle) {
			?><td><?php
			if (!empty($license_data->$fld)) {
				if (($fld == 'expires') and ($license_data->$fld == '1970-01-01 00:00:00'))
					echo '';
				else 
					echo $license_data->$fld;
			}	
			else echo '&nbsp;';	
			?></td><?php
		}
		?></tr>
		</table><?php
  }
	else {
		echo '<p class="error"><strong>Error Fetching License Status.  Try logging on to '.AMR_USERS_STORE_URL.'</strong></p>';
		return false;
	}
}

function amr_users_handle_license_data_request ($licenses) { // will normally only be one
	foreach ($licenses as $l => $license_name) {
		if (!empty($_POST['get_license_data'][$l])) {
			$license_data = amr_users_get_license_data($l);
			amr_users_show_license($license_data);
		}
	}
}			

function amr_users_get_status_text($status) {
			if (empty($status)) {
				$status_text= '<span style="color:red;">'.
					__('Plugin updates not activated','amr-users')
					 .'</span>';  
				 
					 }
			elseif ( $status == 'valid' ) {
					$status_text = '<span style="color:green;">'.
					__('Activated','amr-users')
					.'</span>'; 

					}
			else {
					 '<span style="color:red;">'.
					 $status_text =__('Deactivated','amr-users')
					 .'</span>';  

				}
				return ($status_text);
}

function amr_users_license_page() {

	if (!current_user_can('manage_options')) return;

	$licenses = amr_get_licenses();  // ones we already have saved and new ones from plugins just activated.

// check if we should be doing any form processing and was the post from this page
	
	if ( isset( $_POST['submit'] )  or 
	!empty($_POST['activate'] ) or
	!empty($_POST['deactivate'] ) or
	!empty($_POST['get_license_data'] ) or 
	!empty($_POST['get_plugin_version'] )
	)  {
		check_admin_referer('amr_users_nonce','amr_users_nonce');
		
		if ( isset( $_POST['submit'] ) or !empty($_POST['activate']) )
			amr_users_save_licenses($licenses);
			
		if (!empty($_POST['activate'])) {
			amr_users_activate_licenses($licenses);
		}
		elseif (!empty($_POST['deactivate'])) {
			amr_users_deactivate_license($licenses);
		}
		elseif (!empty($_POST['get_license_data']) and is_array($_POST['get_license_data'])) {
			//amr_users_handle_license_data_request($licenses);
		}
		elseif (!empty($_POST['get_plugin_version'])) {
			//amr_users_get_plugin_version($id);
		}
		
	}
	$key=array();
	foreach ($licenses as $license_short_name => $license_name) {
			$key[$license_short_name] 			= get_option( $license_short_name.'-license-key' );   // array (plugin -> array (licensekey, status, url?)
			$status [$license_short_name]		= get_option( $license_short_name.'-license-status' );
			$status_text[$license_short_name] 	= amr_users_get_status_text($status[$license_short_name]);				
	}
	$base = get_permalink();
	?>
	<div class="wrap">
		<h2><?php _e('add on plugin updates','amr-users'); ?></h2>
		<?php if (empty ($licenses)) { ?>
		<p><?php _e('Either you have no add-ons active or the versions you have cannot yet check for updates.','amr-users');
		?></p><p><?php
			printf(__('Please check manually for updates at %s.','amr-users'),
		'<a title="'.__('See plugins','amr-users').'" href="'.AMR_USERS_STORE_URL.'">'.AMR_USERS_STORE_URL.'</a>'); ?></p>
		<?php } 
		else {?>
		<p><?php printf(__('Enter your license keys to activate automatic plugin updates from %s','amr-users'),
		'<a title="'.__('See plugins','amr-users').'" href="'.AMR_USERS_STORE_URL.'">'.AMR_USERS_STORE_URL.'</a>'); ?></p>

		<form method="post" action="<?php echo $base; ?>">		
			<?php 
			wp_nonce_field( 'amr_users_nonce', 'amr_users_nonce' );?>
			<table class="widefat">
				<tbody><tr>
						<th><?php _e('Plugin name','amr-users'); ?>
						</th>
						<th><?php _e('License key','amr-users'); ?>
						</th>
					</tr>
						<?php 

					foreach ($licenses as $l => $license_name) {
					?>
					<tr>
						<td><b style="font-size: larger; valign:bottom;"><?php echo $license_name; ?></b>
						</td>
						<td>
							<input id="<?php echo $key[$l]; ?>" name="key[<?php echo $l; ?>]" type="text" class="regular-text" value="<?php esc_attr_e( $key[$l] ); ?>" />						
						</td>
					</tr>
					<tr>
						<td valign="top">
							<?php 
							if (!empty($_POST['get_license_data'] )) {  //needs changing
								
								if (is_array($_POST['get_license_data']) and (!empty ($_POST['get_license_data'][$l]))) {
									$license_data = amr_users_get_license_data($l);
									amr_users_show_license( $license_data );
								}
							}
							elseif (!empty($_POST['get_plugin_version'] )) {

								if (is_array($_POST['get_plugin_version']) and (!empty ($_POST['get_plugin_version'][$l]))) {
									$version_data = amr_users_get_plugin_version($l);
									amr_users_show_version( $version_data );
								}
							}
							else  echo ($status_text[$l]); ?>							
							
						</td>
						<td> 
						<?php 
						if ( !empty( $key[$l] ) and ( $status[$l] !== false && $status[$l] == 'valid' )) { ?>
								<input type="submit" class="button-secondary" name="deactivate[<?php echo $l; ?>]" value="<?php _e('Deactivate','amr-users'); ?>"
								title="<?php _e('Deactivate this site from automatic plugin update checking.','amr-users'); ?>" />	
							<?php } 
						else {  ?>
								<input type="submit" class="button-primary" name="activate[<?php echo $l; ?>]" value="<?php _e('Activate','amr-users'); ?>"
								title="<?php _e('Activate automatic plugin update checking with valid license key.','amr-users'); ?>" />	
						<?php }
							
							?>							
							&nbsp;
							<input type="submit" class="button-secondary" name="get_license_data[<?php echo $l; ?>]" value="<?php _e('Check License','amr-users'); ?>"
							title="<?php _e('Check updates license details on plugin hosting system.','amr-users'); ?>" />		
							&nbsp;
							<input type="submit" class="button-secondary" name="get_plugin_version[<?php echo $l; ?>]" value="<?php _e('Latest Version','amr-users'); ?>"
							title="<?php _e('Check for latest plugin version after entering your updates license key','amr-users'); ?>" />
							<?php 
							//} 
						
						?>						
						</td>
					</tr>
				<?php }
				?>			
					</tbody>
			</table> 
				
			<?php submit_button( __('Save without activating','amr-users')); ?>
			
		</form>
	<?php } 
}
