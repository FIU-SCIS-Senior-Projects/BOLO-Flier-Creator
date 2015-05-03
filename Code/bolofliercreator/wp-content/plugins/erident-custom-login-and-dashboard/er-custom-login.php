<?php
/*
Plugin Name: Erident Custom Login and Dashboard
Plugin URI: http://www.eridenttech.com/wp-plugins/erident-custom-login-and-dashboard
Description: Customize completely your WordPress Login Screen and Dashboard. Add your company logo to login screen, change background colors, styles, button color etc. Customize your Dashboard footer text also for complete branding.
Text Domain: erident-custom-login-and-dashboard
Domain Path: /languages
Version: 3.3.1
Author: Libin V Babu
Author URI: http://www.libin.in/
License: GPL
*/

/*  Copyright 2014  Libin V Babu  (email : libin@libin.in)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

load_plugin_textdomain('erident-custom-login-and-dashboard', false, basename( dirname( __FILE__ ) ) . '/languages/' );

function my_admin_head() {
    echo '<link rel="stylesheet" type="text/css" media="all" href="' .plugins_url('er-admin.css', __FILE__). '">';
	echo '<link rel="stylesheet" type="text/css" media="all" href="' .plugins_url('farbtastic/farbtastic.css', __FILE__). '">';
}

add_action('admin_head', 'my_admin_head');
/* Add Settings link to plugins */
function er_add_settings_link($links, $file) {
	static $this_plugin;
	if (!$this_plugin) $this_plugin = plugin_basename(__FILE__);

	if ($file == $this_plugin){
		$settings_link = '<a href="options-general.php?page=erident-custom-login-and-dashboard">'.__("Settings", "erident-custom-login-and-dashboard").'</a>';
		array_unshift($links, $settings_link);
	}
	return $links;
}
add_filter('plugin_action_links', 'er_add_settings_link', 10, 2 );

add_filter('admin_footer_text', 'left_admin_footer_text_output'); //left side
function left_admin_footer_text_output($er_left) {
    /*Get all options from db */
    $er_options = get_option('plugin_erident_settings');
    return stripslashes($er_options['dashboard_data_left']);
}
 
add_filter('update_footer', 'right_admin_footer_text_output', 11); //right side
function right_admin_footer_text_output($er_right) {
    /*Get all options from db */
    $er_options = get_option('plugin_erident_settings');
    return stripslashes($er_options['dashboard_data_right']);
}

/* Login Logo */
function er_login_logo() {
	/*Get all options from db */
    $er_options = get_option('plugin_erident_settings');
    
    if($er_options['dashboard_check_shadow'] == "Yes") { 
		$er_login_link_shadow = $er_options['dashboard_link_shadow'].' 0 1px 0';
	}
	else {
		$er_login_link_shadow = "none";
	}
	if($er_options['dashboard_check_form_shadow'] == "Yes") { 
		$er_login_form_shadow = '0 4px 10px -1px '.$er_options['dashboard_form_shadow'];
	}
	else {
		$er_login_form_shadow = "none";
	}
	
    /* Check if opacity field is empty */
	if($er_options['dashboard_login_bg_opacity'] == "") { 
		$er_login_default_opacity = "1";
	}
    else {
        $er_login_default_opacity = $er_options['dashboard_login_bg_opacity'];
    }
	function er_hex2rgb( $colour ) {
        if ( $colour[0] == '#' ) {
                $colour = substr( $colour, 1 );
        }
        if ( strlen( $colour ) == 6 ) {
                list( $r, $g, $b ) = array( $colour[0] . $colour[1], $colour[2] . $colour[3], $colour[4] . $colour[5] );
        } elseif ( strlen( $colour ) == 3 ) {
                list( $r, $g, $b ) = array( $colour[0] . $colour[0], $colour[1] . $colour[1], $colour[2] . $colour[2] );
        } else {
                return false;
        }
        $r = hexdec( $r );
        $g = hexdec( $g );
        $b = hexdec( $b );
        return array( 'red' => $r, 'green' => $g, 'blue' => $b );
	}
	$btnrgba =  er_hex2rgb( $er_options['dashboard_button_color'] );
    $loginbg = er_hex2rgb( $er_options['dashboard_login_bg'] );
    
	?>
    <style type="text/css">
		/* Styles loading from Erident Custom Login and Dashboard Plugin*/
		html {
			background: none !important;
		}
        html body.login {
			background: <?php echo $er_options['top_bg_color'] ?> url(<?php echo $er_options['top_bg_image'] ?>) <?php echo $er_options['top_bg_repeat'] ?> <?php echo $er_options['top_bg_xpos'] ?> <?php echo $er_options['top_bg_ypos'] ?> !important;
			background-size: <?php echo $er_options['top_bg_size'] ?> !important;
		}
		body.login div#login h1 a {
            background-image: url(<?php echo $er_options['dashboard_image_logo'] ?>) !important;
            padding-bottom: 30px;
			margin: 0 auto;
			background-size: <?php echo $er_options['dashboard_image_logo_width'] ?>px <?php echo $er_options['dashboard_image_logo_height'] ?>px;
			width: <?php echo $er_options['dashboard_image_logo_width'] ?>px;
			height: <?php echo $er_options['dashboard_image_logo_height'] ?>px;
        }
		body.login #login {
		width:<?php echo $er_options['dashboard_login_width'] ?>px;
		}
		.login form {
			border-radius:<?php echo $er_options['dashboard_login_radius'] ?>px;
			border:<?php echo $er_options['dashboard_border_thick'] ?>px <?php echo $er_options['dashboard_login_border'] ?> <?php echo $er_options['dashboard_border_color'] ?>;
			background:rgba(<?php echo $loginbg['red'];?>,<?php echo $loginbg['green']?>,<?php echo $loginbg['blue']?>,<?php echo $er_login_default_opacity; ?>) url(<?php echo $er_options['login_bg_image'] ?>) <?php echo $er_options['login_bg_repeat'] ?> <?php echo $er_options['login_bg_xpos'] ?> <?php echo $er_options['login_bg_ypos'] ?>;
			-moz-box-shadow:    <?php echo $er_login_form_shadow ?>;
			-webkit-box-shadow: <?php echo $er_login_form_shadow ?>;
			box-shadow:         <?php echo $er_login_form_shadow ?>;
		}
		body.login div#login form p label {
			color:<?php echo $er_options['dashboard_text_color'] ?>;
			font-size:<?php echo $er_options['dashboard_label_text_size'] ?>px;
		}
		body.login #loginform p.submit .button-primary, body.wp-core-ui .button-primary {
			background: <?php echo $er_options['dashboard_button_color'] ?> !important;
			border: none !important;
            text-shadow: <?php echo $er_login_link_shadow ?>;
		}
		body.login #loginform p.submit .button-primary:hover, body.login #loginform p.submit .button-primary:focus, body.wp-core-ui .button-primary:hover {
			background: rgba(<?php echo $btnrgba['red'];?>,<?php echo $btnrgba['green']?>,<?php echo $btnrgba['blue']?>, 0.9) !important;
		}
		body.login div#login form .input, .login input[type="text"] {
				color: <?php echo $er_options['dashboard_input_text_color'] ?>;
				font-size:<?php echo $er_options['dashboard_input_text_size'] ?>px;
		}
		body.login #nav a, body.login #backtoblog a {
			color: <?php echo $er_options['dashboard_link_color'] ?> !important;
		}
		body.login #nav, body.login #backtoblog {
			text-shadow: <?php echo $er_login_link_shadow ?>;
		}
    </style>
	<?php
}
add_action( 'login_enqueue_scripts', 'er_login_logo' );

/* Login Links */
function my_login_logo_url() {
    return get_bloginfo( 'url' );
}
add_filter( 'login_headerurl', 'my_login_logo_url' );

function er_login_logo_url_title() {
    /*Get all options from db */
    $er_options = get_option('plugin_erident_settings');
    return stripslashes($er_options['dashboard_power_text']);
}
add_filter( 'login_headertitle', 'er_login_logo_url_title' );


/**
 * Process a settings export that generates a .json file of the erident settings
 */
function er_process_settings_export() {

	if( empty( $_POST['er_action'] ) || 'export_settings' != $_POST['er_action'] )
		return;

	if( ! wp_verify_nonce( $_POST['er_export_nonce'], 'er_export_nonce' ) )
		return;

	if( ! current_user_can( 'manage_options' ) )
		return;

	$settings = get_option( 'plugin_erident_settings' );

	ignore_user_abort( true );

	nocache_headers();
	header( 'Content-Type: application/json; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=erident-settings-export-' . date( 'm-d-Y' ) . '.json' );
	header( "Expires: 0" );

	echo json_encode( $settings );
	exit;
}
add_action( 'admin_init', 'er_process_settings_export' );

/**
 * Process a settings import from a json file
 */
function er_process_settings_import() {

	if( empty( $_POST['er_action'] ) || 'import_settings' != $_POST['er_action'] )
		return;

	if( ! wp_verify_nonce( $_POST['er_import_nonce'], 'er_import_nonce' ) )
		return;

	if( ! current_user_can( 'manage_options' ) )
		return;

	$extension = end( explode( '.', $_FILES['import_file']['name'] ) );

	if( $extension != 'json' ) {
		wp_die( __( 'Please upload a valid .json file' ) );
	}

	$import_file = $_FILES['import_file']['tmp_name'];

	if( empty( $import_file ) ) {
		wp_die( __( 'Please upload a file to import' ) );
	}

	// Retrieve the settings from the file and convert the json object to an array.
	$settings = (array) json_decode( file_get_contents( $import_file ) );

	update_option( 'plugin_erident_settings', $settings );
    echo '<div id="message" class="updated fade"><p><strong>' . __('New settings imported successfully!') . '</strong></p></div>';

}
add_action( 'admin_init', 'er_process_settings_import' );



/* Runs when plugin is activated */
register_activation_hook(__FILE__,'wp_erident_dashboard_install'); 

/* Runs on plugin deactivation*/
register_deactivation_hook( __FILE__, 'wp_erident_dashboard_remove' );

function wp_erident_dashboard_install() {
/* Creates new database field */
    
    $er_new_options = array(
        'dashboard_data_left' => 'Powered by YourWebsiteName',
		'dashboard_data_right' => '&copy; 2014 All Rights Reserved',
        'dashboard_image_logo' => plugins_url('images/default-logo.png', __FILE__),
        'dashboard_image_logo_width' => '274',
        'dashboard_image_logo_height' => '63',
        'dashboard_power_text' => 'Powered by YourWebsiteName',
        'dashboard_login_width' => '350',
        'dashboard_login_radius' => '10',
        'dashboard_login_border' => 'solid',
        'dashboard_border_thick' => '4',
        'dashboard_border_color' => '#0069A0',
        'dashboard_login_bg' => '#dbdbdb',
        'dashboard_login_bg_opacity' => '1',
        'dashboard_text_color' => '#000000',
        'dashboard_input_text_color' => '#555555',
        'dashboard_label_text_size' => '14',
        'dashboard_input_text_size' => '24',
        'dashboard_link_color' => '#21759B',
        'dashboard_check_shadow' => 'Yes',
        'dashboard_link_shadow' => '#ffffff',
        'dashboard_check_form_shadow' => 'Yes',
        'dashboard_form_shadow' => '#C8C8C8',
        'dashboard_button_color' => '#5E5E5E',
        'top_bg_color' => '#f9fad2',
        'top_bg_image' => plugins_url('images/top_bg.jpg', __FILE__),
        'top_bg_repeat' => 'repeat',
        'top_bg_xpos' => 'top',
        'top_bg_ypos' => 'left',
        'login_bg_image' => plugins_url('images/form_bg.jpg', __FILE__),
        'login_bg_repeat' => 'repeat',
        'login_bg_xpos' => 'top',
        'login_bg_ypos' => 'left',
        'top_bg_size' => 'auto',
        'dashboard_delete_db' => 'No'
    );
    
    // if old options exist, update to new system
    $check_db_key = get_option( 'wp_erident_dashboard_delete_db');
    	
    if(!empty($check_db_key)) {
        foreach( $er_new_options as $key => $value ) {
            $existing = get_option( 'wp_erident_' . $key );
            $er_new_options[$key] = $existing;
            delete_option( 'wp_erident_' . $key );
        }
    }
    
    add_option( 'plugin_erident_settings', $er_new_options );
}

function wp_erident_dashboard_remove() {
	/*Get all options from db */
    $er_options = get_option('plugin_erident_settings');
    
    if($er_options['dashboard_delete_db'] == "Yes") { 
/* Deletes the database field */
delete_option('plugin_erident_settings');
	}
	else { }
}

if ( is_admin() ){
	add_action( 'admin_init', 'wp_erident_dashboard_admin_init' );
	add_action( 'admin_menu', 'wp_erident_dashboard_admin_menu' );

    function wp_erident_dashboard_admin_init() {
        /* Register our script.*/
		wp_enqueue_script( 'farbtastic', array('jquery') );
    }

    function wp_erident_dashboard_admin_menu() {
        /* Register our plugin page */
        $page = add_options_page(__('Custom Login and Dashboard', 'erident-custom-login-and-dashboard'), __('Custom Login and Dashboard', 'erident-custom-login-and-dashboard'), 'administrator', 'erident-custom-login-and-dashboard', 'wp_erident_dashboard_html_page');

        /* Using registered $page handle to hook script load */
        add_action('admin_print_styles-' . $page, 'wp_erident_dashboard_admin_styles');
    }

    function wp_erident_dashboard_admin_styles() {
        /*
         * It will be called only on your plugin admin page, enqueue our script here
         */
        wp_enqueue_script( 'wp_erident_dashboard-script2' );
		wp_enqueue_script( 'wp_erident_dashboard-script' );
    } 
/* Call the html code */
   
}
function wp_erident_dashboard_html_page() {
?>

<div class="wrap">
	<div id="icon-options-general" class="icon32"><br></div>
	<h2><?php _e( 'Erident Custom Login and Dashboard Settings', 'erident-custom-login-and-dashboard' ); ?></h2>
	<p><i><?php _e( 'Plugin Loads default values for all below entries. Please change the values to yours.', 'erident-custom-login-and-dashboard' ); ?></i><br/><span style="background: #f9ff0a;"><?php _e( 'Click on the header of each block to open it.', 'erident-custom-login-and-dashboard' ); ?></span></p>
	<form class="wp-erident-dashboard" method="post">

<?php 
if( isset($_POST['er_update_settings']) ) {
	$er_new_options = $_POST['er_options_up'];
	update_option( 'plugin_erident_settings', $er_new_options);
	echo '<div id="message" class="updated fade"><p><strong>' . __('Settings saved.') . '</strong></p></div>';
} ?>
<?php /*Get all options from db */
$er_options = get_option('plugin_erident_settings');
?>
<div class="postbox">
<div class="handlediv" title="Click to toggle"><br></div>
<h3 class="hndle" title="Click to toggle"><span><?php _e( 'Dashboard Settings', 'erident-custom-login-and-dashboard' ); ?></span>
<span class="postbox-title-action"><?php _e( '(These settings will be reflected when a user/admin logins to the WordPress Dashboard)', 'erident-custom-login-and-dashboard' ); ?></span>
</h3>
<div class="inside">
<table border="0">
  <tr valign="top">
    <th scope="row"><?php _e( 'Enter the text for dashboard left side footer:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield" name="er_options_up[dashboard_data_left]" type="text" id="wp_erident_dashboard_data_left"
value="<?php echo esc_html( stripslashes($er_options['dashboard_data_left'] )); ?>" placeholder="Text for dashboard left side footer" />
	<br />
    <span class="description"><?php _e( 'This will replace the default "Thank you for creating with WordPress" on the bottom left side of dashboard', 'erident-custom-login-and-dashboard' ); ?></span>
	</td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Enter the text for dashboard right side footer:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield" name="er_options_up[dashboard_data_right]" type="text" id="wp_erident_dashboard_data_right"
value="<?php echo esc_html( stripslashes($er_options['dashboard_data_right'] )); ?>" placeholder="Text for dashboard left right footer"  />
    <br />
    <span class="description"><?php _e( 'This will replace the default "WordPress Version" on the bottom right side of dashboard', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
</table>
</div><!-- end inside -->
</div><!-- end postbox -->

<div class="postbox">
<div class="handlediv" title="Click to toggle"><br></div>
<h3 class="hndle" title="Click to toggle"><span><?php _e( 'Login Screen Background', 'erident-custom-login-and-dashboard' ); ?></span>
<span class="postbox-title-action"><?php _e( '(The following settings will be reflected on the "wp-login.php" page)', 'erident-custom-login-and-dashboard' ); ?></span>
</h3>
<div class="inside">
<table border="0">
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Screen Background Color:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_top_bg_color" name="er_options_up[top_bg_color]" value="<?php echo $er_options['top_bg_color']; ?>" />
    <div id="ilctabscolorpicker4"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Screen Background Image:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield" name="er_options_up[top_bg_image]" type="text" id="wp_erident_top_bg_image"
value="<?php echo $er_options['top_bg_image']; ?>" />
    <br />
    <span class="description"><?php _e( 'Add your own pattern/image url for the screen background. Leave blank if you don\'t need any images.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Screen Background Repeat', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <?php 
    switch($er_options['top_bg_repeat'])
		  		{
				case 'none':
				$er_screen_a='selected="selected"';
				$er_screen_b=$er_screen_c=$er_screen_d="";
				break;
				
				case 'repeat':
				$er_screen_b='selected="selected"';
				$er_screen_a=$er_screen_c=$er_screen_d="";
				break;
				
				case 'repeat-x':
				$er_screen_c='selected="selected"';
				$er_screen_a=$er_screen_b=$er_screen_d="";
				break;
				
				case 'repeat-y':
				$er_screen_d='selected="selected"';
				$er_screen_a=$er_screen_b=$er_screen_c="";
				break;
				
				default:
				$er_screen_a=$er_screen_b=$er_screen_c=$er_screen_d="";
				break;
				}
     ?>       
    <select class="er-textfield-small" name="er_options_up[top_bg_repeat]" id="wp_erident_top_bg_repeat">
      <option value="no-repeat" <?php echo $er_screen_a; ?>>No Repeat</option>
      <option value="repeat" <?php echo $er_screen_b; ?>>Repeat</option>
      <option value="repeat-x" <?php echo $er_screen_c; ?>>Repeat-x</option>
      <option value="repeat-y" <?php echo $er_screen_d; ?>>Repeat-y</option>
    </select>
    
    <br />
    <span class="description"><?php _e( 'Select an image repeat option from dropdown.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Background Position:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><?php _e( 'Horizontal Position: ', 'erident-custom-login-and-dashboard' ); ?> <input class="er-textfield-small" name="er_options_up[top_bg_xpos]" type="text" id="wp_erident_top_bg_xpos"
value="<?php echo $er_options['top_bg_xpos']; ?>" />
	Vertical Position: <input class="er-textfield-small" name="er_options_up[top_bg_ypos]" type="text" id="wp_erident_top_bg_ypos"
value="<?php echo $er_options['top_bg_ypos']; ?>" />
    <br />
    <span class="description"><?php _e( 'The background-position property sets the starting position of a background image. If you entering the value in "pixels" or "percentage", add "px" or "%" at the end of value. This will not show any changes if you set the Background Repeat option as "Repeat". <a href="http://www.w3schools.com/cssref/pr_background-position.asp" target="_blank">More Info</a>', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Background Size:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield-small" name="er_options_up[top_bg_size]" type="text" id="wp_erident_top_bg_size"
value="<?php echo $er_options['top_bg_size']; ?>" />
    <br />
    <span class="description"><?php _e( 'The background-size property specifies the size of a background image. If you entering the value in "pixels" or "percentage", add "px" or "%" at the end of value. Possible values: auto, length, percentage, cover, contain. <a href="http://www.w3schools.com/cssref/css3_pr_background-size.asp" target="_blank">More Info</a>', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
</table>
</div><!-- end inside -->
</div><!-- end postbox -->


<div class="postbox">
<div class="handlediv" title="Click to toggle"><br></div>
<h3 class="hndle" title="Click to toggle"><span><?php _e( 'Login Screen Logo', 'erident-custom-login-and-dashboard' ); ?></span>
<span class="postbox-title-action"><?php _e( '(Change the default WordPress logo and powered by text)', 'erident-custom-login-and-dashboard' ); ?></span>
</h3> 
<div class="inside openinside">
<table>  
  <tr valign="top">
    <th scope="row"><?php _e( 'Logo Url:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield" name="er_options_up[dashboard_image_logo]" type="text" id="wp_erident_dashboard_image_logo"
value="<?php echo $er_options['dashboard_image_logo']; ?>" /> <span class="description"><?php _e( 'Default Logo Size 274px × 63px', 'erident-custom-login-and-dashboard' ); ?></span>
    <br />
    <span class="description"><?php _e( '(URL path to image to replace default WordPress Logo. (You can upload your image with the WordPress media uploader)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Logo Width:', 'erident-custom-login-and-dashboard' ); ?></th>
   <td><input class="er-textfield-small" name="er_options_up[dashboard_image_logo_width]" type="text" id="wp_erident_dashboard_image_logo_width"
value="<?php echo $er_options['dashboard_image_logo_width']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Your Logo width(Enter in pixels). Default: 274px', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Logo Height:', 'erident-custom-login-and-dashboard' ); ?></th>
   <td><input class="er-textfield-small" name="er_options_up[dashboard_image_logo_height]" type="text" id="wp_erident_dashboard_image_logo_height"
value="<?php echo $er_options['dashboard_image_logo_height']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Your Logo Height(Enter in pixels). Default: 63px', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Powered by Text:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield" name="er_options_up[dashboard_power_text]" type="text" id="wp_erident_dashboard_power_text"
value="<?php echo stripslashes($er_options['dashboard_power_text']); ?>" />
    <br />
    <span class="description"><?php _e( 'Show when mouse hover over custom Login logo', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
</table>
</div><!-- end inside -->
</div><!-- end postbox -->


<div class="postbox">
<div class="handlediv" title="Click to toggle"><br></div>
<h3 class="hndle" title="Click to toggle"><span><?php _e( 'Login Form Settings', 'erident-custom-login-and-dashboard' ); ?></span>
<span class="postbox-title-action"><?php _e( '(The following settings will change the Login Form style)', 'erident-custom-login-and-dashboard' ); ?></span>
</h3>
<div class="inside">
<table>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login form width:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield-small" name="er_options_up[dashboard_login_width]" type="text" id="wp_erident_dashboard_login_width"
value="<?php echo $er_options['dashboard_login_width']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Total Form width(Enter in pixels). Default: 350px', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Border Radius:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield-small" name="er_options_up[dashboard_login_radius]" type="text" id="wp_erident_dashboard_login_radius"
value="<?php echo $er_options['dashboard_login_radius']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Border Radius of Login Form. This is the option to make the corners rounded.(Enter in pixels)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Border Style', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <?php 
    switch($er_options['dashboard_login_border'])
		  		{
				case 'none':
				$er_a='selected="selected"';
				$er_b=$er_c=$er_d=$er_e="";
				break;
				
				case 'solid':
				$er_b='selected="selected"';
				$er_a=$er_c=$er_d=$er_e="";
				break;
				
				case 'dotted':
				$er_c='selected="selected"';
				$er_a=$er_b=$er_d=$er_e="";
				break;
				
				case 'dashed':
				$er_d='selected="selected"';
				$er_a=$er_b=$er_c=$er_e="";
				break;
				
				case 'double':
				$er_e='selected="selected"';
				$er_a=$er_b=$er_c=$er_d="";
				break;
				
				default:
				$er_a=$er_b=$er_c=$er_d=$er_e="";
				break;
				}
     ?>       
    <select class="er-textfield-small" name="er_options_up[dashboard_login_border]" id="wp_erident_dashboard_login_border">
      <option value="none" <?php echo $er_a; ?>>None</option>
      <option value="solid" <?php echo $er_b; ?>>Solid</option>
      <option value="dotted" <?php echo $er_c; ?>>Dotted</option>
      <option value="dashed" <?php echo $er_d; ?>>Dashed</option>
      <option value="double" <?php echo $er_e; ?>>Double</option>
    </select>

    <br />
    <span class="description"><?php _e( 'Select a Border Style option from dropdown.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Border Thickness:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield-small" name="er_options_up[dashboard_border_thick]" type="text" id="wp_erident_dashboard_border_thick"
value="<?php echo $er_options['dashboard_border_thick']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Thickness of Border (Enter value in pixels)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Border Color:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_border_color" name="er_options_up[dashboard_border_color]" value="<?php echo $er_options['dashboard_border_color']; ?>" />
    <div id="ilctabscolorpicker"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Background Color:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_login_bg" name="er_options_up[dashboard_login_bg]" value="<?php echo $er_options['dashboard_login_bg']; ?>" />
    <div id="ilctabscolorpicker2"></div>
    <?php _e( 'Background Opacity: ', 'erident-custom-login-and-dashboard' ); ?> <input class="er-textfield-small" name="er_options_up[dashboard_login_bg_opacity]" type="number" step="0.1" min="0" max="1"  id="wp_erident_dashboard_login_bg_opacity" value="<?php echo $er_options['dashboard_login_bg_opacity']; ?>" />
    <br />
    <span class="description"><?php _e( 'Click the box to select a color. Background Opacity will helps you to put transparent color over a background image. Possible values 0 to 1. Example: 0.5 means 50% transparency. Default: 1 <a href="https://wordpress.org/plugins/erident-custom-login-and-dashboard/faq/" target="_blank">More Info</a>', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Background Image:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield" name="er_options_up[login_bg_image]" type="text" id="wp_erident_login_bg_image" value="<?php echo $er_options['login_bg_image']; ?>" />
    <br />
    <span class="description"><?php _e( 'Add your own pattern/image url to the form background. Leave blank if you don\'t need any images.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Background Repeat', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <?php 
    switch($er_options['login_bg_repeat'])
		  		{
				case 'none':
				$er_login_a='selected="selected"';
				$er_login_b=$er_login_c=$er_login_d="";
				break;
				
				case 'repeat':
				$er_login_b='selected="selected"';
				$er_login_a=$er_login_c=$er_login_d="";
				break;
				
				case 'repeat-x':
				$er_login_c='selected="selected"';
				$er_login_a=$er_login_b=$er_login_d="";
				break;
				
				case 'repeat-y':
				$er_login_d='selected="selected"';
				$er_login_a=$er_login_b=$er_login_c="";
				break;
				
				default:
				$er_login_a=$er_login_b=$er_login_c=$er_login_d="";
				break;
				}
     ?>       
    <select class="er-textfield-small" name="er_options_up[login_bg_repeat]" id="wp_erident_login_bg_repeat">
      <option value="no-repeat" <?php echo $er_login_a; ?>>No Repeat</option>
      <option value="repeat" <?php echo $er_login_b; ?>>Repeat</option>
      <option value="repeat-x" <?php echo $er_login_c; ?>>Repeat-x</option>
      <option value="repeat-y" <?php echo $er_login_d; ?>>Repeat-y</option>
    </select>
    
    <br />
    <span class="description"><?php _e( 'Select an image repeat option from dropdown.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Background Position:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><?php _e( 'Horizontal Position: ', 'erident-custom-login-and-dashboard' ); ?><input class="er-textfield-small" name="er_options_up[login_bg_xpos]" type="text" id="wp_erident_login_bg_xpos"
value="<?php echo $er_options['login_bg_xpos']; ?>" />
	<?php _e( 'Vertical Position: ', 'erident-custom-login-and-dashboard' ); ?><input class="er-textfield-small" name="er_options_up[login_bg_ypos]" type="text" id="wp_erident_login_bg_ypos"
value="<?php echo $er_options['login_bg_ypos']; ?>" />
    <br />
    <span class="description"><?php _e( 'The background-position property sets the starting position of a background image. If you entering the value in "pixels" or "percentage", add "px" or "%" at the end of value. This will not show any changes if you set the Background Repeat option as "Repeat". <a href="http://www.w3schools.com/cssref/pr_background-position.asp" target="_blank">More Info</a>', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Label Text Color', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_text_color" name="er_options_up[dashboard_text_color]" value="<?php echo $er_options['dashboard_text_color']; ?>" />
    <div id="ilctabscolorpicker3"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color. This will change the color of label Username/Password', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Label Text Size:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield-small" name="er_options_up[dashboard_label_text_size]" type="text" id="wp_erident_dashboard_label_text_size" value="<?php echo $er_options['dashboard_label_text_size']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Font Size of Label Username/Password(Enter value in pixels)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Input Text Color', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_input_text_color" name="er_options_up[dashboard_input_text_color]" value="<?php echo $er_options['dashboard_input_text_color']; ?>" />
    <div id="ilctabscolorpicker8"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color. This will change the color of text inside text box.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Input Text Size:', 'erident-custom-login-and-dashboard' ); ?></th>
    <td><input class="er-textfield-small" name="er_options_up[dashboard_input_text_size]" type="text" id="wp_erident_dashboard_input_text_size" value="<?php echo $er_options['dashboard_input_text_size']; ?>" />px
    <br />
    <span class="description"><?php _e( 'Font Size of text inside text box(Enter value in pixels)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Form Link Color', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_link_color" name="er_options_up[dashboard_link_color]" value="<?php echo $er_options['dashboard_link_color']; ?>" />
    <div id="ilctabscolorpicker5"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <tr valign="top">
    <th scope="row"><?php _e( 'Enable link shadow?', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <?php 
	$check_sh = $er_options['dashboard_check_shadow'];
	if($check_sh == 'Yes') { $sx = "checked"; $sy = ''; } else { $sy = "checked"; $sx = ''; } ?>

      <label>
        <input type="radio" name="er_options_up[dashboard_check_shadow]" value="Yes" id="wp_erident_dashboard_check_shadow_0" <?php echo $sx; ?>  onclick="$('#hide-this').show('normal')" />
        <?php _e( 'Yes', 'erident-custom-login-and-dashboard' ); ?></label>

      <label>
        <input type="radio" name="er_options_up[dashboard_check_shadow]" value="No" id="wp_erident_dashboard_check_shadow_1" <?php echo $sy; ?> onclick="$('#hide-this').hide('normal')" />
        <?php _e( 'No', 'erident-custom-login-and-dashboard' ); ?></label>
    <br />
    <span class="description"><?php _e( '(Check an option)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top" id="hide-this">
    <th scope="row"><?php _e( 'Login Form Link Shadow Color', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_link_shadow" name="er_options_up[dashboard_link_shadow]" value="<?php echo $er_options['dashboard_link_shadow']; ?>" />
    <div id="ilctabscolorpicker6"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
  <!-- Form Shadow -->
  <tr valign="top">
    <th scope="row"><?php _e( 'Enable form shadow?', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <?php 
	$check_fsh = $er_options['dashboard_check_form_shadow'];
	if($check_fsh == 'Yes') { $fsx = "checked"; $fsy = ''; } else { $fsy = "checked"; $fsx = ''; } ?>

      <label>
        <input type="radio" name="er_options_up[dashboard_check_form_shadow]" value="Yes" id="wp_erident_dashboard_check_form_shadow_0" <?php echo $fsx; ?>  onclick="$('#hide-this2').show('normal')" />
        <?php _e( 'Yes', 'erident-custom-login-and-dashboard' ); ?></label>

      <label>
        <input type="radio" name="er_options_up[dashboard_check_form_shadow]" value="No" id="wp_erident_dashboard_check_form_shadow_1" <?php echo $fsy; ?> onclick="$('#hide-this2').hide('normal')" />
        <?php _e( 'No', 'erident-custom-login-and-dashboard' ); ?></label>
    <br />
    <span class="description"><?php _e( '(Check an option)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <tr valign="top" id="hide-this2">
    <th scope="row"><?php _e( 'Login Form Shadow Color', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_form_shadow" name="er_options_up[dashboard_form_shadow]" value="<?php echo $er_options['dashboard_form_shadow']; ?>" />
    <div id="ilctabscolorpicker7"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  <!-- end Form shadow -->
  
  <!-- Login Button Color -->
  <tr valign="top">
    <th scope="row"><?php _e( 'Login Button Color', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <input class="er-textfield-small" type="text" id="wp_erident_dashboard_button_color" name="er_options_up[dashboard_button_color]" value="<?php echo $er_options['dashboard_button_color']; ?>" />
    <div id="ilctabscolorpicker9"></div>
    <br />
    <span class="description"><?php _e( 'Click the box to select a color.', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
  
</table>
</div><!-- end inside -->
</div><!-- end postbox -->


<div class="postbox">
<div class="handlediv" title="Click to toggle"><br></div>
<h3 class="hndle" title="Click to toggle"><span><?php _e( 'Plugin Un-install Settings', 'erident-custom-login-and-dashboard' ); ?></span>
</h3>
<div class="inside">
<table border="0">
  <tr valign="top">
    <th scope="row"><?php _e( 'Delete custom settings upon plugin deactivation?', 'erident-custom-login-and-dashboard' ); ?></th>
    <td>
    <?php 
	$check = $er_options['dashboard_delete_db'];
	if($check == 'Yes') { $x = "checked"; $y = ''; } else { $y = "checked"; $x = ''; } ?>

      <label>
        <input type="radio" name="er_options_up[dashboard_delete_db]" value="Yes" id="wp_erident_dashboard_delete_db_0" <?php echo $x; ?> />
        <?php _e( 'Yes', 'erident-custom-login-and-dashboard' ); ?></label>

      <label>
        <input type="radio" name="er_options_up[dashboard_delete_db]" value="No" id="wp_erident_dashboard_delete_db_1" <?php echo $y; ?> />
        <?php _e( 'No', 'erident-custom-login-and-dashboard' ); ?></label>
    <br />
    <span class="description"><?php _e( '(If you set "Yes" all custom settings will be deleted from database upon plugin deactivation)', 'erident-custom-login-and-dashboard' ); ?></span>
    </td>
  </tr>
</table>
</div><!-- end inside -->
</div><!-- end postbox -->
			
<p>
<input type="submit" name="er_update_settings" class="button-primary" value="<?php _e('Save Changes') ?>" />
</p>

</form>

<div class="postbox">
   <div class="handlediv" title="Click to toggle"><br></div>
    <h3 class="hndle" title="Click to toggle"><span><?php _e( 'Export Settings', 'erident-custom-login-and-dashboard' ); ?></span></h3>
    <div class="inside">
        <p><?php _e( 'Export the plugin settings for this site as a .json file. This allows you to easily import the configuration into another site.', 'erident-custom-login-and-dashboard' ); ?></p>
        <form method="post">
            <p><input type="hidden" name="er_action" value="export_settings" /></p>
            <p>
                <?php wp_nonce_field( 'er_export_nonce', 'er_export_nonce' ); ?>
                <?php submit_button( __( 'Export' ), 'secondary', 'submit', false ); ?>
            </p>
        </form>
    </div><!-- .inside -->
</div><!-- .postbox -->
			
<div class="postbox">
   <div class="handlediv" title="Click to toggle"><br></div>
    <h3 class="hndle" title="Click to toggle"><span><?php _e( 'Import Settings', 'erident-custom-login-and-dashboard' ); ?></span></h3>
    <div class="inside">
        <p><?php _e( 'Import the plugin settings from a .json file. This file can be obtained by exporting the settings on another site using the form above.', 'erident-custom-login-and-dashboard' ); ?></p>
        <form method="post" enctype="multipart/form-data">
            <p>
                <input type="file" name="import_file"/>
            </p>
            <p>
                <input type="hidden" name="er_action" value="import_settings" />
                <?php wp_nonce_field( 'er_import_nonce', 'er_import_nonce' ); ?>
                <?php submit_button( __( 'Import' ), 'secondary', 'submit', false ); ?>
            </p>
        </form>
    </div><!-- .inside -->
</div><!-- .postbox -->

</div>
<script type="text/javascript">
 
  jQuery(document).ready(function() {
    jQuery('#ilctabscolorpicker').hide();
    jQuery('#ilctabscolorpicker').farbtastic("#wp_erident_dashboard_border_color");
    jQuery("#wp_erident_dashboard_border_color").click(function(){jQuery('#ilctabscolorpicker').slideDown()});
	jQuery("#wp_erident_dashboard_border_color").blur(function(){jQuery('#ilctabscolorpicker').slideUp()});
	
	jQuery('#ilctabscolorpicker2').hide();
	jQuery('#ilctabscolorpicker2').farbtastic("#wp_erident_dashboard_login_bg");
    jQuery("#wp_erident_dashboard_login_bg").click(function(){jQuery('#ilctabscolorpicker2').slideDown()});
	jQuery("#wp_erident_dashboard_login_bg").blur(function(){jQuery('#ilctabscolorpicker2').slideUp()});
	
	jQuery('#ilctabscolorpicker3').hide();
	jQuery('#ilctabscolorpicker3').farbtastic("#wp_erident_dashboard_text_color");
    jQuery("#wp_erident_dashboard_text_color").click(function(){jQuery('#ilctabscolorpicker3').slideDown()});
	jQuery("#wp_erident_dashboard_text_color").blur(function(){jQuery('#ilctabscolorpicker3').slideUp()});
	
	jQuery('#ilctabscolorpicker4').hide();
	jQuery('#ilctabscolorpicker4').farbtastic("#wp_erident_top_bg_color");
    jQuery("#wp_erident_top_bg_color").click(function(){jQuery('#ilctabscolorpicker4').slideDown()});
	jQuery("#wp_erident_top_bg_color").blur(function(){jQuery('#ilctabscolorpicker4').slideUp()});
	
	jQuery('#ilctabscolorpicker5').hide();
	jQuery('#ilctabscolorpicker5').farbtastic("#wp_erident_dashboard_link_color");
    jQuery("#wp_erident_dashboard_link_color").click(function(){jQuery('#ilctabscolorpicker5').slideDown()});
	jQuery("#wp_erident_dashboard_link_color").blur(function(){jQuery('#ilctabscolorpicker5').slideUp()});
	
	jQuery('#ilctabscolorpicker6').hide();
	jQuery('#ilctabscolorpicker6').farbtastic("#wp_erident_dashboard_link_shadow");
    jQuery("#wp_erident_dashboard_link_shadow").click(function(){jQuery('#ilctabscolorpicker6').slideDown()});
	jQuery("#wp_erident_dashboard_link_shadow").blur(function(){jQuery('#ilctabscolorpicker6').slideUp()});
	
	jQuery('#ilctabscolorpicker7').hide();
	jQuery('#ilctabscolorpicker7').farbtastic("#wp_erident_dashboard_form_shadow");
    jQuery("#wp_erident_dashboard_form_shadow").click(function(){jQuery('#ilctabscolorpicker7').slideDown()});
	jQuery("#wp_erident_dashboard_form_shadow").blur(function(){jQuery('#ilctabscolorpicker7').slideUp()});
	
	jQuery('#ilctabscolorpicker8').hide();
	jQuery('#ilctabscolorpicker8').farbtastic("#wp_erident_dashboard_input_text_color");
    jQuery("#wp_erident_dashboard_input_text_color").click(function(){jQuery('#ilctabscolorpicker8').slideDown()});
	jQuery("#wp_erident_dashboard_input_text_color").blur(function(){jQuery('#ilctabscolorpicker8').slideUp()});
	
	jQuery('#ilctabscolorpicker9').hide();
	jQuery('#ilctabscolorpicker9').farbtastic("#wp_erident_dashboard_button_color");
    jQuery("#wp_erident_dashboard_button_color").click(function(){jQuery('#ilctabscolorpicker9').slideDown()});
	jQuery("#wp_erident_dashboard_button_color").blur(function(){jQuery('#ilctabscolorpicker9').slideUp()});
	
	jQuery( ".postbox .hndle" ).on( "mouseover", function() {
		jQuery( this ).css( "cursor", "pointer" );
	});
	
	/* Sliding the panels */
	jQuery(".postbox").on('click', '.handlediv', function(){
		jQuery(this).siblings(".inside").slideToggle();
	});
	jQuery(".postbox").on('click', '.hndle', function(){
		jQuery(this).siblings(".inside").slideToggle();
	});
  });
 
</script>
<?php
}
?>