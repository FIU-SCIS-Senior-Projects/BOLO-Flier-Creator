<?php
/**
 * Template Name: ArchiveResultsView
 *
 * @package Inkness
 */
?>

<?php //1542?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Search Result BOLO</title>
    <link rel="stylesheet" type="text/css" href="css/layout.css" />
	<link rel="stylesheet" href="estilos.css" />
</head>

<?php
get_header(); ?>
<body>

<?php
echo("<br>");


if($_POST['iniDate']!="")
{
    $iniDate = $_POST['iniDate'];
}else
{
    $iniDate = "";
}
if($_POST['endDate']!="")
{
    $endDate = $_POST['endDate'];
}else
{
    $endDate = "";
}

	echo("<br>");
	
    include_once 'Model_Bolo.php';
    $bolo = new Model_Bolo();
	
	//return all bolos that match with the criteria of the search
    
     
    $resultProp1= $bolo->searchdate($iniDate,$endDate);
	
	$cont = 0;
	
	echo '<div class="container">';
			echo '<table style="width:60%">';
				echo '<tr>';
					echo '<th>BOLO ID</th>';
				    echo '<th>Name</th>'; 
				    echo '<th>Category</th>';
					echo '<th>Date</th>';
					echo '<th></th>';
				echo '</tr>';
    while ($row= mysqli_fetch_array($resultProp1))
    {
		
       	$resultName = $row['myName'];
        $resultId = $row['bolo_id'];
		$allId[$cont] = $resultId;
		$cont++;
		
		

        echo '<tr>';	
									
						echo '<td>' . $row['bolo_id'] . '</td>';
						echo '<td>' . $row['myName'] . $row['lastName']. '</td>';
						echo '<td>' . $row['selectcat'] . '</td>';						
						echo '<td>' . $row['datecreated'] . '</td>';				
											
		echo '</tr>';
				 
    }
			
			

	?>
	<?php			
	echo "<td><a onClick=\"javascript: return confirm('Please confirm archive');\" href='?page_id=1539&idate=".$iniDate."&edate=".$endDate." '>Archive ALL</a></td><tr>";
         ?>                          	
							
                     
       				 
   <?php
	if($cont==0){
		$_SESSION["mensaje"] = "Nothing Match, Try again";
			//echo "<script>window.location = 'http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1494'</script>";
	}
	//get_footer();
?>

</body>
</html>

