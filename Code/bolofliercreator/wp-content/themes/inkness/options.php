<?php
/**
 * A unique identifier is defined to store the options in the database and reference them from the theme.
 * By default it uses the theme name, in lowercase and without spaces, but this can be changed if needed.
 * If the identifier changes, it'll appear as if the options have been reset.
 */

function optionsframework_option_name() {

	// This gets the theme name from the stylesheet
	$themename = wp_get_theme();
	$themename = preg_replace("/\W/", "_", strtolower($themename) );

	$optionsframework_settings = get_option( 'optionsframework' );
	$optionsframework_settings['id'] = $themename;
	update_option( 'optionsframework', $optionsframework_settings );
}

/**
 * Defines an array of options that will be used to generate the settings page and be saved in the database.
 * When creating the 'id' fields, make sure to use all lowercase and no spaces.
 *
 * If you are making your theme translatable, you should replace 'inkness'
 * with the actual text domain for your theme.  Read more:
 * http://codex.wordpress.org/Function_Reference/load_theme_textdomain
 */

function optionsframework_options() {

	$options = array();
	$imagepath =  get_template_directory_uri() . '/images/';	
	
	//Basic Settings
	
	$options[] = array(
		'name' => __('Basic Settings', 'inkness'),
		'type' => 'heading');
			
	$options[] = array(
		'name' => __('Site Logo', 'inkness'),
		'desc' => __('Leave Blank to use text Heading.', 'inkness'),
		'id' => 'logo',
		'class' => '',
		'type' => 'upload');		
		
	$options[] = array(
		'name' => __('Copyright Text', 'inkness'),
		'desc' => __('Some Text regarding copyright of your site, you would like to display in the footer.', 'inkness'),
		'id' => 'footertext2',
		'std' => '',
		'type' => 'text');
	
	$options[] = array(
		'desc' => __('To have more customization options including Analytics, Custom Header/Footer Scripts <a href="http://inkhive.com/product/inkness-plus/" target="_blank">Upgrade to Pro</a> at Just $25.95'),
		'std' => '',
		'type' => 'info');
		
	//Design Settings
		
	$options[] = array(
		'name' => __('Layout Settings', 'inkness'),
		'type' => 'heading');	
	
	$options[] = array(
		'desc' => __('With <a href="http://inkhive.com/product/inkness-plus/" target="_blank">Pro Version</a> You also have the option to Remove Search Bar from header, and move to a full width menu. Upgrade at Just $25.95'),
		'type' => 'info');	
		
	$options[] = array(
		'name' => "Sidebar Layout",
		'desc' => "Select Layout for Posts & Pages.",
		'id' => "sidebar-layout",
		'std' => "right",
		'type' => "images",
		'options' => array(
			'left' => $imagepath . '2cl.png',
			'right' => $imagepath . '2cr.png')
	);
	
	$options[] = array(
		'desc' => __('<a href="http://inkhive.com/product/inkness-plus/" target="_blank">Pro Version</a> supports the option to add custom skins, styles & Layouts. Upgrade at Just $25.95.'),
		'std' => '',
		'type' => 'info');
			
	
	$options[] = array(
		'name' => __('Custom CSS', 'inkness'),
		'desc' => __('Some Custom Styling for your site. Place any css codes here instead of the style.css file.', 'inkness'),
		'id' => 'style2',
		'std' => '',
		'type' => 'textarea');
	
	//SLIDER SETTINGS

	$options[] = array(
		'name' => __('Slider Settings', 'inkness'),
		'type' => 'heading');

	$options[] = array(
		'name' => __('Enable Slider', 'inkness'),
		'desc' => __('Check this to Enable Slider.', 'inkness'),
		'id' => 'slider_enabled',
		'type' => 'checkbox',
		'std' => '0' );
		
	$options[] = array(
		'desc' => __('In the <a href="http://inkhive.com/product/inkness-plus/" target="_blank">Pro Version (InkNess Plus)</a> there are options to customize slider by choosing form over 16 animation effects, ability to set transition time and speed and more. You Can Also Choose Full-Width/Fixed-Width Slider. Upgrade at Just $25.95'),
		'std' => '',
		'type' => 'info');	
		
	$options[] = array(
		'name' => __('Using the Slider', 'inkness'),
		'desc' => __('This Slider supports upto 5 Images. To show only 3 Slides in the slider, upload only 3 images. Leave the rest Blank. For best results, upload images of same dimensions.', 'inkness'),
		'type' => 'info');

	$options[] = array(
		'name' => __('Slider Image 1', 'inkness'),
		'desc' => __('First Slide', 'inkness'),
		'id' => 'slide1',
		'class' => '',
		'type' => 'upload');
	
	$options[] = array(
		'desc' => __('Title', 'inkness'),
		'id' => 'slidetitle1',
		'std' => '',
		'type' => 'text');
	
	$options[] = array(
		'desc' => __('Description or Tagline', 'inkness'),
		'id' => 'slidedesc1',
		'std' => '',
		'type' => 'textarea');			
		
	$options[] = array(
		'desc' => __('Url', 'inkness'),
		'id' => 'slideurl1',
		'std' => '',
		'type' => 'text');		
	
	$options[] = array(
		'name' => __('Slider Image 2', 'inkness'),
		'desc' => __('Second Slide', 'inkness'),
		'class' => '',
		'id' => 'slide2',
		'type' => 'upload');
	
	$options[] = array(
		'desc' => __('Title', 'inkness'),
		'id' => 'slidetitle2',
		'std' => '',
		'type' => 'text');	
	
	$options[] = array(
		'desc' => __('Description or Tagline', 'inkness'),
		'id' => 'slidedesc2',
		'std' => '',
		'type' => 'textarea');		
		
	$options[] = array(
		'desc' => __('Url', 'inkness'),
		'id' => 'slideurl2',
		'std' => '',
		'type' => 'text');	
		
	$options[] = array(
		'name' => __('Slider Image 3', 'inkness'),
		'desc' => __('Third Slide', 'inkness'),
		'id' => 'slide3',
		'class' => '',
		'type' => 'upload');	
	
	$options[] = array(
		'desc' => __('Title', 'inkness'),
		'id' => 'slidetitle3',
		'std' => '',
		'type' => 'text');	
		
	$options[] = array(
		'desc' => __('Description or Tagline', 'inkness'),
		'id' => 'slidedesc3',
		'std' => '',
		'type' => 'textarea');	
			
	$options[] = array(
		'desc' => __('Url', 'inkness'),
		'id' => 'slideurl3',
		'std' => '',
		'type' => 'text');		
	
	$options[] = array(
		'name' => __('Slider Image 4', 'inkness'),
		'desc' => __('Fourth Slide', 'inkness'),
		'id' => 'slide4',
		'class' => '',
		'type' => 'upload');	
		
	$options[] = array(
		'desc' => __('Title', 'inkness'),
		'id' => 'slidetitle4',
		'std' => '',
		'type' => 'text');
	
	$options[] = array(
		'desc' => __('Description or Tagline', 'inkness'),
		'id' => 'slidedesc4',
		'std' => '',
		'type' => 'textarea');			
		
	$options[] = array(
		'desc' => __('Url', 'inkness'),
		'id' => 'slideurl4',
		'std' => '',
		'type' => 'text');		
	
	$options[] = array(
		'name' => __('Slider Image 5', 'inkness'),
		'desc' => __('Fifth Slide', 'inkness'),
		'id' => 'slide5',
		'class' => '',
		'type' => 'upload');	
		
	$options[] = array(
		'desc' => __('Title', 'inkness'),
		'id' => 'slidetitle5',
		'std' => '',
		'type' => 'text');	
	
	$options[] = array(
		'desc' => __('Description or Tagline', 'inkness'),
		'id' => 'slidedesc5',
		'std' => '',
		'type' => 'textarea');		
		
	$options[] = array(
		'desc' => __('Url', 'inkness'),
		'id' => 'slideurl5',
		'std' => '',
		'type' => 'text');	
			
	//Social Settings
	
	$options[] = array(
	'name' => __('Social Settings', 'inkness'),
	'type' => 'heading');

	$options[] = array(
		'desc' => __('To Add your Own icons, and Choose different image styles for Social Icons, purchase <a href="http://inkhive.com/product/inkness-plus/" target="_blank">Pro Version (InkNess Plus)</a>. Upgrade at Just $25.95'),
		'std' => '',
		'type' => 'info');	

	$options[] = array(
		'name' => __('Facebook', 'inkness'),
		'desc' => __('Facebook Profile or Page URL i.e. http://facebook.com/username/ ', 'inkness'),
		'id' => 'facebook',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');
	
	$options[] = array(
		'name' => __('Twitter', 'inkness'),
		'desc' => __('Twitter Username', 'inkness'),
		'id' => 'twitter',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');
	
	$options[] = array(
		'name' => __('Google Plus', 'inkness'),
		'desc' => __('Google Plus profile url, including "http://"', 'inkness'),
		'id' => 'google',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Feeburner', 'inkness'),
		'desc' => __('URL for your RSS Feeds', 'inkness'),
		'id' => 'feedburner',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');	
		
	$options[] = array(
		'name' => __('Pinterest', 'inkness'),
		'desc' => __('Your Pinterest Profile URL', 'inkness'),
		'id' => 'pinterest',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Instagram', 'inkness'),
		'desc' => __('Your Instagram Profile URL', 'inkness'),
		'id' => 'instagram',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');	
		
	$options[] = array(
		'name' => __('Linked In', 'inkness'),
		'desc' => __('Your Linked In Profile URL', 'inkness'),
		'id' => 'linkedin',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');	
		
	$options[] = array(
		'name' => __('Youtube', 'inkness'),
		'desc' => __('Your Youtube Channel URL', 'inkness'),
		'id' => 'youtube',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');
		
	$options[] = array(
		'name' => __('Flickr', 'inkness'),
		'desc' => __('Your Flickr Profile URL', 'inkness'),
		'id' => 'flickr',
		'std' => '',
		'class' => 'mini',
		'type' => 'text');	
		
	$options[] = array(
		'desc' => __('More social Icons are available in the <a href="http://inkhive.com/product/inkness-plus/" target="_blank">Pro Version (InkNess Plus)</a>. Upgrade at Just $25.95'),
		'std' => '',
		'type' => 'info');							
		
	$options[] = array(
	'name' => __('Support', 'inkness'),
	'type' => 'heading');
	
	$options[] = array(
		'desc' => __('Inkness WordPress theme has been Designed and Created by <a href="http://InkHive.com" target="_blank">Rohit Tripathi</a>. For any Queries or help regarding this theme, <a href="http://wordpress.org/support/theme/inkness/" target="_blank">use the support forums.</a>', 'inkness'),
		'type' => 'info');		
		
	 $options[] = array(
		'desc' => __('<a href="http://twitter.com/rohitinked" target="_blank">Follow Me on Twitter</a> to know about my upcoming themes.', 'inkness'),
		'type' => 'info');
		
	$options[] = array(
		'name' => __('Live Demo Blog', 'inkness'),
		'desc' => __('For your convenience, we have created a <a href="http://demo.inkhive.com/inkness/" target="_blank">Live Demo Blog</a> of the theme Inkness. You can take a look at and find out how your site would look once complete.', 'inkness'),
		'type' => 'info');		
		
	$options[] = array(
		'desc' => __('We Offer Dedicated Personal Support to all our <a href="http://inkhive.com/product/inkness-plus/" target="_blank">Pro Version Customers</a>. Upgrade at Just $25.95'),
		'std' => '',
		'type' => 'info');			
	
	$options[] = array(
		'name' => __('Regenerating Post Thumbnails', 'inkness'),
		'desc' => __('If you are using inkness Theme on a New Wordpress Installation, then you can skip this section.<br />But if you have just switched to this theme from some other theme, then you are requested regenerate all the post thumbnails. It will fix all the issues you are facing with distorted & ugly homepage thumbnail Images. ', 'inkness'),
		'type' => 'info');	
		
	$options[] = array(
		'desc' => __('To Regenerate all Thumbnail images, Install and Activate the <a href="http://wordpress.org/plugins/regenerate-thumbnails/" target="_blank">Regenerate Thumbnails</a> WP Plugin. Then from <strong>Tools &gt; Regen. Thumbnails</strong>, re-create thumbnails for all your existing images. And your blog will look even more stylish with Inkness theme.<br /> ', 'inkness'),
		'type' => 'info');	
		
			
	$options[] = array(
		'desc' => __('<strong>Note:</strong> Regenerating the thumbnails, will not affect your original images. It will just generate a separate image file for those images.', 'inkness'),
		'type' => 'info');	
		
	
	$options[] = array(
		'name' => __('Remove Credit Links in Footer', 'inkness'),
		'desc' => __('Check this if you want to you do not want to give us credit in your site footer.', 'inkness'),
		'id' => 'credit1',
		'std' => '0',
		'type' => 'checkbox');	

	return $options;
}