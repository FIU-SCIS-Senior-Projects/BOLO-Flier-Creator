<?php
/**
 * Template Name: Home Page
 *
 * @package Inkness
 */
?>

<?php
include_once("HomeMVC/home_model.php");
include_once("HomeMVC/home_view.php");

$model = new home_model();
$view = new home_view();

$agencies = $model->get_agencies();

//get the bolos for the desired agency (default value = 'Show ALL')
$result = $model->get_data($_POST['agency'], $_POST['offset']+0);
//update the view with the new data
$view->update_view($result, $agencies, $_POST['agency'], $_POST['offset']+0);

?>
<script type="text/javascript">
    document.getElementById("myButton").onclick = function () {
        location.href = "?page_id=6";
    };
</script>