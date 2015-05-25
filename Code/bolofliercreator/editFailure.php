<?php
/**
 * Template Name: Edit Error
 * Gives the user and error message if a BOLO update fails
 * @package Inkness
 */
?>

<?php
echo "Error while updating BOLO. Please contact administrator";
sleep(8);
echo "Redirecting back to homepage";
sleep(2);
header('Location: /bolofliercreator/');
?>