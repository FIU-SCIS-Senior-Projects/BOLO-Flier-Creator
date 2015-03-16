<?php get_header(); ?>
<?php
/**
 * Template Name: Home Page
 *
 * @package Inkness
 */
?>

<!DOCTYPE html>
<html>

<head>
	  <link href="/HomePage/style.css" rel="stylesheet">
	  <script type="text/javascript" src="<http://code.jquery.com/jquery-1.7.2.min.js>"></script>
	  <script type="text/javascript" src="script.js"></script>
</head>

<body>
	<?php
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
	
	$sql = <<<SQL
    SELECT *
    FROM `wp_flierform` ORDER BY datecreated DESC LIMIT 24
SQL;
	
	if(!$result = $conn->query($sql)){
	    die('There was an error running the query [' . $db->error . ']');
	}	
	?>
	
	<div class="container">
		<!-- Row 1 -->
		<div class="horizontal">  
			<!-- Thumbnail 1 -->        
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 2 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 3 -->	
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 4 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div> <!-- end thumbnail -->
        </div>
        <!-- Row 2 -->
        <div class="horizontal">  
			<!-- Thumbnail 1 -->        
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 2 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 3 -->	
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 4 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div> <!-- end thumbnail -->
        </div>
        <!-- Row 3 -->
        <div class="horizontal">  
			<!-- Thumbnail 1 -->        
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 2 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 3 -->	
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 4 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div> <!-- end thumbnail -->
        </div>
        <!-- Row 4 -->
        <div class="horizontal">  
			<!-- Thumbnail 1 -->        
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 2 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 3 -->	
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 4 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div> <!-- end thumbnail -->
        </div>
        <!-- Row 5 -->
        <div class="horizontal">  
			<!-- Thumbnail 1 -->        
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 2 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 3 -->	
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 4 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div> <!-- end thumbnail -->
        </div>
        <!-- Row 6 -->
        <div class="horizontal">  
			<!-- Thumbnail 1 -->        
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 2 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 3 -->	
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div>
			<!-- Thumbnail 4 -->
			<div class="thumbnail">
				<?php
					$row = $result->fetch_assoc();
			    	echo $row['selectcat'] . '<br />';
					$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
					echo '<img src="'.$img.'">' . '<br />';
					echo $row['bolo_id'] . '<br />';
					echo $row['datecreated'];
				?>
			</div> <!-- end thumbnail -->
        </div>
	
	</div>​	
	

</html>
</body>

<?php get_footer(); ?>