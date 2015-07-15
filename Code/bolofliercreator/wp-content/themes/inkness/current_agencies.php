<?php
/**
 * Template Name: Agencies List Page
 *
 * @package Inkness
 */
 ?>
 <?php //page 1508?>
 <?php get_header();?>
 
 <?php
 include_once('new_agency_control.php');
     $control = new agency_control();
     $result = $control->get_agencies();
 ?>
<style>
    th, td {
            padding: 10px;
            max-height: 10px;
            }
</style>
<div class="container">
    <table style="width:70%">
        <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Zip</th>
            <th>State</th>
            <th>Phone</th>
        </tr>
        <?php
        while($row = $result->fetch_assoc()){
            echo '<tr>';            
            echo '<td>' . $row['name'] . '</td>';
            echo '<td>' . $row['st_address'] . '</td>';
            echo '<td>' . $row['city'] . '</td>';                       
            echo '<td>' . $row['zip'] . '</td>';
            echo '<td>FL</td>';
            echo '<td>' . $row['phone'] . '</td>';
            echo '<td> <a href="?page_id=1585&idAgency=' . $row['id'] . '">Edit</a></td>';
            echo '</tr>';
        }
        ?>
    </table>
    <form action="?page_id=1510&function2=new_agency" method="POST" enctype="multipart/form-data">
        <!-- New Agency Button -->
            <div class="col-md-9">
                <button  id="submit" name="submit"  class="btn btn-primary" align = "right">New Agency</button>             
            </div>
    </form>
    
</div>



<?php get_footer();?>
