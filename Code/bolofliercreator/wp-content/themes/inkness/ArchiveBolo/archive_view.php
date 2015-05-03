<?php

/**
 * Template Name: Archive View Page
 *
 * @package Inkness
 * 
 * page 1537
 */
 ?>
 

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Archive BOLO</title>
    <link rel="stylesheet" type="text/css" href="css/layout.css" />
	<link rel="stylesheet" href="estilos.css" />
	
	<script src="jquery-1.6.2.min.js"></script>
    <script src="jquery-ui-1.8.15.custom.min.js"></script>
    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <link rel="stylesheet" href="jqueryCalendar.css">
    
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
	</head>
    <script type="text/javascript">
    

		$(function() {
			$("#date1").datepicker(
				{
					dateFormat: "yy-mm-dd"
				}
			);
			});
			
		$(function() {
			$("#date2").datepicker(
				{
					dateFormat: "yy-mm-dd"
				}
			);
			});
	</script>
	


<?php
get_header(); 

?>

<body>


<div class="container">
	<div class="row">
		<div class="col-md-6">
			<div class="form-group">
				

<form action="http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1542" id="buscarForm" method="post">
<div class="col-md-6">
    <table align="center">
        <tr align="center">
            <td colspan="2">
                <h4>Archive Bolo</h4>
            </td>
        </tr>

	<div class="controls">
	<div class="col-md-6">
		<tr align="center">
            <td align="center" colspan="2">
                <br>
				<label>Date from:</label>
				<input id="date1" type="text" placeholder="YY-MM-DD" name="iniDate">
				
            </td>
        </tr>
		<div class="controls">
	<div class="col-md-6">
		<tr align="center">
            <td align="center" colspan="2">
                <br>
				<label>Date to:</label>
				<input id="date2" type="text" placeholder="YY-MM-DD" name="endDate">
				
            </td>
        </tr>
		
		

	<br />
        <tr align="center">
            <td align="center" colspan="2">
            		<br />
                <input type="submit" value="Search to Archive" >
            </td>
        </tr>
		
    </table>
</form>

</body>
</html>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<?php get_footer(); ?>
 
