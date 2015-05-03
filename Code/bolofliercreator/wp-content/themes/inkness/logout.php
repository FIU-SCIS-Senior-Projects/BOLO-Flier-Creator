<?php

/**
 * Template Name: Logout Page
 *
 * @package Inkness
 * 
 * page 1545
 */
 ?>
<?php 
	wp_logout(); 
	header('Location: /bolofliercreator/');
	die();
?>
