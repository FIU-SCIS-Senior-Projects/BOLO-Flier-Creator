<?php
/**
 * Admin Add-ons
 *
 * @package     
 * @subpackage  Admin/Add-ons
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Add-ons Page Init
 *
 * Hooks check feed to the page load action.
 *
 * @since 1.0
 * @global $amru_add_ons_page  Add-ons Pages
 * @return void
 */
function amru_add_ons_init() {
	global $amru_add_ons_page;
	add_action( 'load-' . $amru_add_ons_page, 'amru_add_ons_check_feed' );
}
add_action( 'admin_menu', 'amru_add_ons_init');

/**
 * Add-ons Page
 *
 * Renders the add-ons page content.
 *
 * @since 1.0
 * @return void
 */
function amru_add_ons_page() {
	$url = 'http://wpusersplugin.com/related-plugins/'
	.'?utm_source=plugin-addons-page'
	.'&amp;utm_medium=plugin'
	.'&amp;utm_campaign=amr-users-plugin%20addons%20page'
	.'&amp;utm_content=All%20Addons';
	?>
	<div class="wrap" id="amru-add-ons">
		<h2>
			<?php _e( 'Add Ons for amr-users', 'amr-users' ); ?>
			&nbsp;&mdash;&nbsp;<a href="<?php echo $url; ?>" class="button-primary" title="<?php _e( 'Browse All Add-ons', 'amr-users' ); ?>" target="_blank"><?php _e( 'Browse All Add-ons', 'amr-users' ); ?></a>
		</h2>
	<?php echo amru_add_ons_get_feed(); ?>
	</div>
<?php
}

/**
 * Add-ons Get Feed
 *
 * Gets the add-ons page feed.
 *
 * @since 1.0
 * @return void
 */
function amru_add_ons_get_feed() {
	$feed_url = 'http://wpusersplugin.com/?feed=addons';
	$transient_name = 'wpusersplugin_add_ons_feed';
	
	if ( false === ( $cache = get_transient( $transient_name ) ) ) {
		$feed = wp_remote_get($feed_url);
		//var_dump($feed);
		if ( ! is_wp_error( $feed ) ) {
			if ( isset( $feed['body'] ) && strlen( $feed['body'] ) > 0 ) {
				$cache = wp_remote_retrieve_body( $feed );
				set_transient( $transient_name, $cache, 1 );
			}
		} else {
			$cache = '<div class="error"><p>' . __( 'There was an error retrieving the add-ons list from the server. Please try again later.', 'amr-users' ) . '</p></div>';
		}
	}
	return $cache;
}