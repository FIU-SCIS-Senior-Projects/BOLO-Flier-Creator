<?php
/**
 * Template Name: ResultSearch Bolo
 *
 * @package Inkness
 */
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


<body style = "background-color: #eae6ae;" >

<?php
if($_POST['id']!="")
{
    $id = $_POST['id'];
}else
{
    $id = "";
}
if($_POST['name']!="")
{
    $name = $_POST['name'];
}else
{
    $name = "";
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




//print_r($_POST);
echo("<br>");
    include_once'Model_Bolo.php';
    $bolo = new Model_Bolo();
    $resultProp1= $bolo->resultadoBusqueda($id,$name,$addr,$classif,$dob,$hcolor,$lic,$race,$reli,$sex,$cat,$val);
	
 echo ("
	
	<div class ='col-md-12'>
	 <h2 style='text-align:center; font-weight: bold;'>Search Results</h2>
	     </div>
    <br>
   "); 
   
    while ($row= $resultProp1->fetch_assoc())
    {
        $resultName = $row['myName'];
        $resultId = $row['bolo_id'];
        echo("<br>");

        echo ('<form name="formBolo" method="get" action="BoloSelected.php" >');
        echo ("<input type= 'hidden' name = 'idBolo' value = \"$resultId\">");
        echo("
        	
  			<br>
  			<br>	
  			<div class='container'>
	 		<div class='row' >
            <div class='col-md-8'>
        <table align='center' class='table'>            
                <tr>
                    <td>
                   	
                        <h4 style='text-align:center; font-weight: bold;'>$resultId &nbsp;&nbsp;&nbsp  $resultName</h4>
                    </td>
                    <td align='right'>
                        <input type='submit' class='btn btn-primary' value='More Details'>
                     
                        
                    </td>

                </tr>
            </table>
            </div>
         </div>
        </div>
        ");

        echo "</form>";
        echo("<br>");
    }


?>
</body>
