<?php


global $user_ID;
$new_post = array(
    'post_title' =>'title' ,
    'post_content' => '<iframe src="http://localhost/bolofliercreator/wp-content/themes/inkness../page-flier.php" frameborder="0" height="800" width="650"></iframe>',

    'post_status' => 'publish',
    'post_date' => date('Y-m-d H:i:s'),
    'post_author' => $user_ID,
    'post_type' => 'post',
    'post_category' => array(0)
);
$post_id = wp_insert_post($new_post);

?>