<?php
/* ---------------------------------------------------------------------------------------------------------*/	
function amr_delete_user_meta($delete) {
	global $wpdb;
	foreach ($delete as $key=>$on) {
		$text[] = $key;
	}
	$string = "'".implode($text,"','")."'";
	
	$q = "DELETE FROM $wpdb->usermeta WHERE meta_key IN (".$string.")";
	$delresult = $wpdb->get_results($q);	
	
	echo amr_users_message(__('Meta records deleted', 'amr-users')); 	
	
}
/* -------------------------------------------------------------------------------------------------------------*/	
function amr_confirm_delete_user_meta($del) {

	echo '<h2>'.__('Please confirm deletion of meta records with these metakeys','amr-users').'</h2>';
	foreach ($del as $name=> $on) {
		echo '<br /><input type="checkbox" id="delete'.$name.'"  name="delete['.$name.']"';
		echo ' value=true checked="checked" ';
		echo ' /> '.$name;
	}
	echo '<p><input class="button-primary" type="submit" name="deleteconfirmed" value="'. __('Confirm Delete', 'amr-users') .'" /></p>';
	
}
/* -------------------------------------------------------------------------------------------------------------*/	
function amr_check_new_metakeys($i, $allkeys) {
if (in_array($i,
			array(
				'admin_color',
				'aim',
				'jabber',
				'yim',
				'comment_shortcuts',
				'rich_editing',
				'show_admin_bar_front',
				'user_level',
				'use_ssl',
				'_woocommerce_persistent_cart',
				'session_tokens',
				'show_welcome_panel'
				)))
			return true;
		// prefixed
		/* and exclude some deprecated fields, since wordpress creates both for backward compatibility ! */	
			elseif (stristr ($i, 'dismissed_')) return true;
			elseif (stristr ($i, 'media_library_mode')) return true;	
			elseif (stristr ($i, 'meta-box-order_')) return true;	
			elseif (stristr ($i, 'last_post_id')) return true;	
			elseif (stristr ($i, 'nav_menu')) return true;	
			elseif (stristr ($i, 'default_password_nag')) return true;	
			elseif (stristr ($i, 'user_description')) return true;	
			elseif (stristr ($i, 'user_lastname')) return true;	
			elseif (stristr ($i, 'user_firstname')) return true;	
			elseif (stristr ($i, 'user_level')) return true;	
			elseif (stristr ($i, 'metabox')) return true;	
			elseif (stristr ($i, 'plugins_last_view')) return true;	
			elseif (stristr ($i, 'closedpostboxes')) return true;	
			elseif (stristr ($i, 'columnshidden')) return true;	
			elseif (stristr ($i, 'screen_layout')) return true;	
			elseif (stristr ($i, 'metaboxhidden_')) return true;	
			elseif (stristr ($i, 'metaboxorder_')) return true;	
			elseif (stristr ($i, '_per_page')) return true;	
			elseif (stristr ($i, 'user-settings')) return true;	
			elseif (stristr ($i, 'user-settings-time')) return true;	
			elseif (stristr ($i, 'manageedit')) return true;	
			elseif (stristr ($i, 'user-settings-time')) return true;	
			elseif ((substr($i,0,1) == '_')  // its a hidden field
				 and (in_array(substr($i,1), $allkeys))) {// if we have a non hidden field with same key, then it assume it's an ACF plugin oddity and hide the weird bits
					return true;
				 }
			else return false;
}
/* -------------------------------------------------------------------------------------------------------------*/	
function amr_default_excluded_metakeys () {
// as highlighted by s2members strange use of a timestamp as the key to an array, we need to be able to exclude meta keys.  Becaus eof multi-site and multi-prefix possiblities in the usermeta, we check for partial match of these strings.
global $wpdb;

// metakeys without prefixes		
		$q = "SELECT DISTINCT (meta_key) FROM $wpdb->usermeta"; 
		$allkeys = $wpdb->get_col($q);

		foreach ($allkeys as $i => $key) {
			$excluded[$key] = amr_check_new_metakeys($key, $allkeys);	
		}
		ausers_update_option('amr-users-excluded-meta-keys', $excluded); 
		return ($excluded);		
	}
/* -------------------------------------------------------------------------------------------------------------*/	
function amrmeta_validate_excluded_keys()	{		

		$excluded_meta_keys = amr_default_excluded_metakeys(); 
		if ((isset($_POST['mex'])) and (is_array($_POST['mex']))) {
			foreach ($_POST['mex'] as $i => $v) {
				if ($v) 
					$excluded_meta_keys[$i] = true; 
				else 
					$excluded_meta_keys[$i] = false; 
			}
		}
		ausers_update_option('amr-users-excluded-meta-keys', $excluded_meta_keys);

		
		echo amr_users_message(__('Options Updated', 'amr-users')); 	
		return (true);	
	}
/* -------------------------------------------------------------------------------------------------------------*/
function ameta_list_excluded_key ($nnid, $nnval, $v, $v2=NULL) {
	
		echo "\n\t".'<li><label class="lists" for="nn'.$nnid.'"  '.(is_null($v2)?'>':' class="nested" >') .$v.' '.$v2.'</label>'
		.'<input type="text" size="50" id="nn'.$nnid.'"  name="nn['.$nnid.']"  value= "'.$nnval.'" /></li>'; 
	}
/* ---------------------------------------------------------------------*/
function ameta_keys_update_buttons () {	
	return ('
	<div  class="submit">
		<input type="hidden" name="action" value="save" />
		<input class="button-primary" type="submit" name="update" value="'. __('Update', 'amr-users') .'" />
		<input type="submit" class="button" name="resetex" value="'. __('Reset', 'amr-users') .'" />
		<input class="button" type="submit" name="delete" value="'. __('Delete', 'amr-users') .'" />
	</div>');
	}	
/* ---------------------------------------------------------------------*/
function ameta_list_excluded_keys() {
global $wpdb;
		//we need to allow manual exclusion of metakeys becuase of s2members strange time keys on access_cap_limits and who knows there might be others.	
		if (!($excluded_meta_keys = ausers_get_option('amr-users-excluded-meta-keys')))  
			$excluded_meta_keys = amr_default_excluded_metakeys();	
		// check if we have any new keys since last time, no need to fetch
		$q = "SELECT meta_key, COUNT(umeta_id) AS Count FROM $wpdb->usermeta GROUP BY meta_key"; 
		$allkeys = $wpdb->get_results($q, ARRAY_A);		
		$num_keys = count($allkeys);
		$exc_keys = 0;
		foreach ($allkeys as $i=>$row) {
			if (!isset($excluded_meta_keys[$row['meta_key']])) {
				$excluded_meta_keys[$row['meta_key']] = false;
				//echo '<br />'.__('Added meta to report DB: ','amr-users').$row['meta_key'];
			}
			if ($excluded_meta_keys[$row['meta_key']]) 
				$exc_keys = $exc_keys+1;
			$totals[$row['meta_key']] = $allkeys[$i]['Count'];
		}

		ksort($excluded_meta_keys);	
		
		echo PHP_EOL.'<div class="clear"> </div>'.PHP_EOL;	
		echo '<div><!-- excluded keys list-->';
		echo '<h2>'.__('User meta keys in this site today', 'amr-users').' ('.$num_keys.') - '
		.sprintf(__('%s excluded','amr-users'),$exc_keys)
		.'</h2>';
		echo '<ul>'
		.'<li>'
		.__('Extracts the current distinct user meta keys used','amr-users')
		.' - <strong>'.__('Sample data MUST exist!','amr-users').'</strong>'
		.'</li>'
		.'</ul>';
		echo ameta_keys_update_buttons(); // the buttons
		echo 
		'<table class="widefat">';
		echo '<tr><th>'
		.__('Meta Key','amr-users')
		.'</th>'
		.'<th>'
		.__('Exclude?','amr-users')
		.'</th>'
		.'<th>'
		.__('Delete meta records?','amr-users')
		.'</th>'
		.'</tr>';
		foreach ($excluded_meta_keys as $i => $v ) {
			if (empty($totals[$i])) continue; //ie it has not been deleted since we saved
			
			echo "\n\t".'<tr>'
			.'<td>'.$i.'</td><td>';

			if ($i==='ID') echo ' ' ;
			else {
				echo '<input type="checkbox" id="mex'.$i.'"  name="mex['.$i.']"';
				if (!empty($excluded_meta_keys[$i])) echo ' value=true checked="checked" ';
				echo ' />';
			}
			
			echo '</td><td>';
			if ($i==='ID') echo ' ' ;
				else {			
						echo '<input type="checkbox" id="del'.$i.'"  name="del['.$i.']"';
						echo ' />';
						echo ' ('.$totals[$i].')';
				}
			echo '</td></tr>';
			
		}	
		echo "\n\t".'</table>'
		.PHP_EOL.
		'</div><!-- excluded keys list-->'.PHP_EOL;
		return;	
		
	}
/* ---------------------------------------------------------------------*/	
function amr_meta_keys_page() {

	global $ausersadminurl;
	
	//amr_meta_main_admin_header('Find fields, make nice names' );
	amr_meta_admin_headings ($plugin_page=''); // does the nonce check etc
	
	if (isset($_POST['action']) and !($_POST['action'] === "save")) return;
	
	echo PHP_EOL.'<div class="clear" style="clear:both;">&nbsp;</div>'.PHP_EOL;
			
			
	if (isset($_POST['deleteconfirmed']) and ($_POST['deleteconfirmed'] === "Confirm Delete")) {
		if ((isset($_POST['delete'])) and (is_array($_POST['delete']))) {
				amr_delete_user_meta($_POST['delete']);
				
			}
		else echo amr_users_message(__('No meta_keys selected for deletion', 'amr-users')); 	
	}		
	elseif (isset($_POST['delete']) and ($_POST['delete'] === "Delete")) {
		if ((isset($_POST['del'])) and (is_array($_POST['del']))) {
				amr_confirm_delete_user_meta($_POST['del']);
			}
		else echo amr_users_message(__('No meta_keys selected for deletion', 'amr-users')); 
		return;
	}
	
	elseif (isset($_POST['update']) and ($_POST['update'] === "Update")) {/* Validate the input and save */
			if (amrmeta_validate_excluded_keys()) { // updates inside the function now
			}
			else echo '<h2>'.__('Validation failed', 'amr-users').'</h2>'; 	
		}
	elseif (isset($_POST['resetex']) and ($_POST['resetex'] === "Reset")) {

		if (ausers_delete_option ('amr-users-excluded-meta-keys'))  //201410 - wrong optionname
			echo '<h2>'.__('Deleting all excluded keys settings in database','amr-users').'</h2>';
	}
	else {
		//amrmeta_check_find_keys();
	}

	ameta_list_excluded_keys(); 

	}	//end amrmeta nice names option_page
	
