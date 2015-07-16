<?php
 
    include_once("new_agency_control.php");
    $controller = new agency_control();
    $agency = $controller->getAgency($_GET["idAgency"]);
    
    $agencyID = $_GET["id"];
    
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
    $sqlAgencyName = <<<SQL
        SELECT name
        FROM agencies
        WHERE id = "$agencyID"
SQL;

    $result = $conn->query($sql);
    
    $agencyName = $result["name"];
    
    $sqlAgencyDelete = <<<SQL
        DELETE FROM agencies
        WHERE id = "$agencyID"
SQL;

    $result = $conn->query($sql);
    
    $sqlAgencyDeleteMeta = <<<SQL
        DELETE FROM wp_usermeta
        WHERE meta_key = agency AND meta_value = "$agencyName"
SQL;

    $result = $conn->query($sql);
    
    
    mysqli_close($conn);  
    
    header('Location: /bolofliercreator/?page_id=1508');
        
 ?>