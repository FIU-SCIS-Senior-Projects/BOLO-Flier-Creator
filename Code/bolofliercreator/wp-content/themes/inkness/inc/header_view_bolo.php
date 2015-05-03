<?php
/**
 * Template Name: Editor View
 *
 * @package Inkness
 */
 ?>
 <?php //page 1524
 //temporary code
 ?>
 
<?php
class head{
	public function _construct(){
		
	}
	
	public function make_banner($author){
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
	    FROM wp_usermeta	    
	    INNER JOIN wp_users	    
	    ON user_id="$author"
	    WHERE meta_key="agency"
SQL;
		if(!$result = $conn->query($sql)){
		    die('There was an error running the query [' . $db->error . ']');
		}
		
		mysqli_close($conn); 
		
		$row = $result->fetch_assoc();
		
		$row['meta_value'];
				
		include("header_model.php");
		$model = new header_model();
		$result = $model->get_agency($row['meta_value']);
		$row2 = $result->fetch_assoc();	
		
		//show a custom background image for pinecrest bolos
		if($row2['name'] == 'Pinecrest'){
			echo "
				<style type='text/css'>				
					body {
						background-image: url('watermark.jpg');
					}				
				</style> ";
		}
		?>
		
		<div class="container">		
		<div id = "pcstation" class="col-md-2" style="text-align:center; padding-top: 25px;">
			<img src="<?php echo $row2['logo1'] ?>" width="120" height="137">	
		</div>
		<div class="col-md-8" style=" padding-top: 25px;">
			<p style="text-align:center; font-size:15px; text-transform:uppercase; margin-top:10px; color:red;">Unclassified// for official use only// law enforcement sensitive </p>
			<h1 style="text-align:center; font-size:24px; margin-bottom:2px; font-weight: bold;"><?php echo $row2['name'] ?> Police Department</h1>
			<h3 style="text-align:center; font-size:20px; line-height:1.2em; font-weight:300;"><em><?php echo $row2['st_address'] ?><br><?php echo $row2['city'] ?>, FL, <?php echo $row2['zip'] ?><br><?php echo $row2['phone'] ?></em></h3>	
		</div>
		<div class="col-md-2" style="text-align:center; padding-top: 25px;">	    
			<img src="<?php echo $row2['logo2'] ?>" width="118" height="160">
		</div>
		<div class = "col-md-12" style="border-bottom: 1px solid #7b7b7b;  margin-bottom: 40px;"></div>	
	</div>
		<?php
		
	}//end function
}
?>
