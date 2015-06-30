<?php
/**
 * Template Name: ResultSearch Bolo
 *
 * @package Inkness
 */
//701
?>


<head>
<meta charset="UTF-8">
<title>ResultSearch Form</title>
<link rel="stylesheet" href="custom-styles.css">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

</head>

<?php
get_header(); ?>
<body style = "background-color: #eae6ae;" >

<?php
if($_POST['agency']!="")
{
    $agency = $_POST['agency'];
}else
{
    $agency = "";
}
if($_POST['nome']!="")
{
    $nome = $_POST['nome'];
}else
{
    $name = "";
}
if($_POST['lastn']!="")
{
    $lastn = $_POST['lastn'];
}else
{
    $lastn = "";
}
if($_POST['addr']!="")
{
    $addr = $_POST['addr'];
}else
{
    $addr = "";
}

if($_POST['classif']!="")
{
    $classif = $_POST['classif'];
}else
{
    $classif = "";
}
if($_POST['dob']!="")
{
    $dob = $_POST['dob'];
}else
{
    $dob = "";
}
if($_POST['hcolor']!="")
{
    $hcolor = $_POST['hcolor'];
}else
{
    $hcolor = "";
}

if($_POST['lic']!="")
{
    $lic = $_POST['lic'];
}else
{
    $lic = "";
}
if($_POST['race']!="")
{
    $race = $_POST['race'];
}else
{
    $race = "";
}
if($_POST['reli']!="")
{
    $reli = $_POST['reli'];
}else
{
    $reli = "";
}

if($_POST['cat']!="")
{
    $cat = $_POST['cat'];
}else
{
    $cat = "";
}
if($_POST['sex']!="")
{
    $sex = $_POST['sex'];
}else
{
    $sex = "";
}
if($_POST['val']!="")
{
    $val = $_POST['val'];
}else
{
    $val = "";
}



$cont = 0;
//print_r($_POST);
echo("<br>");
    include_once'Model_Bolo.php';
    $bolo = new Model_Bolo();
    $resultProp1= $bolo->searchResults($agency,$nome,$lastn,$addr,$dob,$hcolor,$lic,$race,$sex,$cat,$link);
	
 	//if no results
   if($resultProp1->num_rows==0){
		echo "<script>window.location = 'http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1494'</script>";
	   
        
    }
//if there are results
   else{
   echo ("
	
	<div class ='col-md-12'>
	 <h2 style='text-align:center; font-weight: bold;'>Search Results</h2>
	     </div>
    <br>
   "); 
    echo '<div class="container">';
  $quantity = mysqli_num_rows($resultProp1);

	for($r=0; $r<$quantity; $r++){
					echo '<div class="horizontal">';
						//draws 4 thumbnails in the current row
						for($x=0; $x<4; $x++){
							$row = $resultProp1->fetch_assoc();
							$id = $row['bolo_id'];							
							if($id != ''){								
								echo '<div class="thumbnail">';								
									echo '<p style="font-weight:bold;" class="alignleft">'.$row['selectcat'].'</p>';
									echo '<p class="alignright">'.$row['agency'].'</p>';
									$img = '/bolofliercreator/wp-content/themes/inkness/'.$row['image'];
									echo '<img style="height: 200px" src="'.$img.'">' . '<br />';
									echo $id . '<br />';
									echo $row['datecreated'];
									echo "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
									echo ' <a href="?page_id=1488&idBolo=' . "$id" . '"target="_blank">Details  </a>';								
								echo '</div>'; //end of idividual thumbnail		
							}
							else {
								break 2;
							}
						}
					echo '</div>';
				}
			echo '</div>';//end class=container
	
} //end if theres results
	//if($cont==0){
		//echo "<script>window.location = 'http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1494'</script>";       
//    }

 
 
 get_footer(); 
?>

</body>
