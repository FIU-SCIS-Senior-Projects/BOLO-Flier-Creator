<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Inkness
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div id="page" class="hfeed site">
	<?php do_action( 'inkness_before' ); ?>
	<div id="header-top">
		<header id="masthead" class="site-header row container" role="banner">
			<div class="site-branding col-md-6 col-xs-12">

			<?php get_template_part('social', 'fa'); ?>
						
		</header><!-- #masthead -->
	</div>
	
	<div id="header-2">
		<div class="container">
		<div class="default-nav-wrapper col-md-8 col-xs-12"> 	
		   <nav id="site-navigation" class="main-navigation" role="navigation">
	         <div id="nav-container">
				<h1 class="menu-toggle"></h1>
				<div class="screen-reader-text skip-link"><a href="#content" title="<?php esc_attr_e( 'Skip to content', 'inkness' ); ?>"><?php _e( 'Skip to content', 'inkness' ); ?></a></div>
	
				<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
	          </div>  
			</nav><!-- #site-navigation -->
		  </div>
		  
		<div id="top-search" class="col-md-4 col-xs-12">
			
		</div>
		</div>
	</div>

	<?php get_template_part('slider', 'nivo'); ?>
	
		
