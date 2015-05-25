<?php get_header(); ?>
<?php
/**
 * Template Name: Edit Error
 *
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