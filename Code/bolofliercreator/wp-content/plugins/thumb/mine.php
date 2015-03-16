<?php
/*
Plugin Name: thumb
Plugin URI: 
Description: 
Author: 
Author URI: 
Version: 
Text Domain: 
License: 
License 
*/

// Add Shortcode

function hello() {

    // Code

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bolo_creator";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
 } 

$sql = "SELECT selectcat, myName, summary FROM wp_flierform";
$result = $conn->query($sql);

$temp = array(
	'post_title' => 'yankees',
    'post_content' => 'new york',
    'post_status' => 'publish',
    'post_author' => 2,
    'post_type' => 'post',
    'post_category' => array(10)
);

$insert = wp_insert_post( $temp );

echo "cool";

}
add_shortcode( 'hello', 'hello' );

?>
