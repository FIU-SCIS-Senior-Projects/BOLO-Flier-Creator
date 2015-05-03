<?php
/*
 * Plugin Name: Custom user profile
 * Description: Creates custom fields on the user profile page.
 * Author: Icxe Vidal
 */
 
 /**
  * The custom fields implemented so far are: 
  * -Badge number 
  * -Police Agency
  * 
  * It also removes unnecessary options and fields from the
  * user profile
  */

 //shows the extra fields in the edit user screen
function complement_user_profile($user) {
	include_once("model.php");
	include_once("view.php");
	$model = new model();
	$view = new view();
	$result = $model->get_agencies();
	$view->profile_fields($user, $result);
	
}
add_action( 'show_user_profile', 'complement_user_profile' );
add_action( 'edit_user_profile', 'complement_user_profile' );

//save the extra fields to the wp_usermeta table
function save($user_id) {
	update_usermeta( $user_id, 'badge', $_POST['badge'] );
	update_usermeta( $user_id, 'agency', $_POST['agency'] );
}
add_action( 'personal_options_update', 'save' );
add_action( 'edit_user_profile_update', 'save' );

//removes unwanted columns from the users table and adds new ones
function clean_table($column_headers) {
	//unwanted
	unset($column_headers['posts']);
	//new needed columns
	$column_headers['badge'] = 'Badge No';
	$column_headers['agency'] = 'Agency';
	return $column_headers;
}
add_action('manage_users_columns','clean_table');

//populate new columns
function new_colums($value, $column_name, $user_id){
	$user = get_userdata( $user_id );
	if ( 'badge' == $column_name )
		return get_user_meta($user_id, 'badge', true);
	if ( 'agency' == $column_name )
		return get_user_meta($user_id, 'agency', true);
    return $value;	
}
add_action('manage_users_custom_column','new_colums', 10, 3);
?>
