<?php
/**
 * License handler - simplifies the process of adding license information
 * to new extensions.
 * Each addon will use this
 
 *
 * @version 1.1
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

if ( ! class_exists( 'amr_License' ) ) :

/**
 * amr_License Class
 */
class amr_License {
	private $file;
	private $license;
	private $item_name;
	private $item_shortname;
	private $version;
	private $author;
	private $api_url = 'https://wpusersplugin.com';

	/**
	 * Class constructor
	 *
	 * @global  array $edd_options
	 * @param string  $_file
	 * @param string  $_item_name
	 * @param string  $_version
	 * @param string  $_author
	 * @param string  $_optname
	 * @param string  $_api_url
	 */
	
	function __construct( $_file, $_item_name, $_version, $_author, $_optname = null, $_api_url = null ) {

		
		$this->file           = $_file;
		$this->item_name      = $_item_name;
		$this->item_shortname = //'amr_' . 
			preg_replace( '/[^a-zA-Z0-9-\s]/', '', str_replace( ' ', '-', strtolower( $this->item_name ) ) );
		$this->version        = $_version;
		$this->license        = get_option($this->item_shortname . '-license-key'  ) ;
		$this->status         = get_option($this->item_shortname . '-license-status'  ) ;
		//$this->expiry         = get_option $this->item_shortname . '-license-expiry' ] ) ;
		$this->author         = $_author;
		$this->api_url        = is_null( $_api_url ) ? $this->api_url : $_api_url;

		// Setup hooks
		$this->includes();
		$this->hooks();

		add_filter( 'amr_get_licenses', array($this, 'licenses' ) );

	}

	/**
	 * Include the updater class
	 *
	 * @access  private
	 * @return  void
	 */
	private function includes() {
		if ( ! class_exists( 'amr_sl_plugin_updater' ) ) require_once 'plugin-updater.php';
	}

	/**
	 * Setup hooks
	 *
	 * @access  private
	 * @return  void
	 */
	private function hooks() {
		// Register settings
		//add_filter( 'amr_settings_licenses', array( $this, 'settings' ), 1 ); // adds licenses in  NLR?

		// Updater
		add_action( 'admin_init', array( $this, 'auto_updater' ), 0 );
	}

	/**
	 * Auto updater
	 *
	 * @access  private
	 * @global  array $edd_options
	 * @return  void
	 */
	public function auto_updater() {

		if ( 'valid' !== get_option( $this->item_shortname . '_license_active' ) )
			return;

		// Setup the updater
		$edd_updater = new amr_sl_plugin_updater(
			$this->api_url,
			$this->file,
			array(
				'version'   => $this->version,
				'license'   => $this->license,
				'item_name' => $this->item_name,
				'author'    => $this->author
			)
		);
	}


	/**
	 * Add license field to settings
	 *
	 * @access  public
	 * @param array   $settings
	 * @return  array
	 */
	public function licenses( $licenses ) {  // add to the list of licenses to check
	
		$amr_licenses[$this->item_shortname] = $this->item_name;// NO ! messes up the license check.' '.$this->version;
			//array(
			//	'id'      => $this->item_shortname . '-license-key',
			//	'name'    => sprintf( __( '%1$s license key', 'amr-users' ), $this->item_name ),
				//'desc'    => '',
				//'type'    => 'license_key',
				//'options' => array( 'is_valid_license_option' => $this->item_shortname . '_license_active' ),
				//'size'    => 'regular'
			//)
		//);
		return array_merge( $licenses, $amr_licenses );
	}


	/**
	 * Activate the license key
	 *
	 * @access  public
	 * @return  void
	 */



	/**
	 * Deactivate the license key
	 *
	 * @access  public
	 * @return  void
	 */

}

endif; // end class_exists check


