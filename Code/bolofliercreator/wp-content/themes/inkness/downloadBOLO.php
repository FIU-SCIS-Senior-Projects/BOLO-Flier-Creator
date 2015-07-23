<?php

    include_once'flier_model.php';
    $flier = new FlierModel();

    include"BoloPDF/bolo_pdf.php";
    $doc = new bolo_pdf();

    $boloID = $_GET["id"];
    //grab BOLO data from database NOTE: this is a copy of code from BoloSelected.php
    include_once('Model_Bolo.php');
    $bolo = new Model_Bolo();
    $resultProp1= $bolo->infoBolo($prop1);
    $picture = $bolo->loadPicture();


    while ($row= mysqli_fetch_array($resultProp1))
    {

        $resultId =  $row['bolo_id'];
        $resultAddr = $row['address'];
        $resultAdt = $row['adtnlinfo'];
        $resultDob = $row['dob'];
        $resultHair = $row['haircolor'];
        $resultHeight = $row['height'];
        $pathImage = $row['image'];
        $resultName = $row['myName'];
        $resultlastName = $row['lastName'];
        $resultRace = $row['race'];
        $resultCat = $row['selectcat'];
        $resultSex = $row['sex'];
        $resultSumm = $row['summary'];
        $resultTattoo = $row['tattoos'];
        $resultWeight = $row['weight'];
        $resultLicense = $row['license'];
        $resultDate = $row['datecreated'];
        $author = $row['author'];
        $update = $row['update_status'];
        $link = $row['link'];
        $resultAgency = $row['agency'];
    }
    
    $author_name = $bolo->loadAuthor($author);
    
    
    
    //check to see if a PDF has been made of this BOLO before...
    /*note: there is no real primary key for this table, so getting a BOLO wil lrequire extensive query or a rebuild of the entire table with a unique primary key (BoloID is not a viable primary key)
      and neither is dateCeated since a pdf may have been created before the actual BOLO being made. This leaves this hacked together query that does NOT guarantee uniqueness*/
    
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "bolo_creator";
            
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    $boloPDFsql = <<<SQL
    SELECT *
    FROM `bolo_pdf`
    WHERE selectcat='$resultCat' , myName='$resultName' , lastName=' $resultlastName', dob='$resultDob', license='$resultLicense', race='$resultRace', sex='$resultSex', 
        height='$resultHeight', weight='$resultWeight', haircolor='$resultHair',address='$resultAddr',tattoos='$resultTattoo',summary='$resultSumm',
        adtnlinfo='$resultAdt',author='$author',agency='$resultAgency',image='$pathImage',link='$link'"; 
SQL;
       
    $previousPDF = $conn->query($boloPDFsql);
    
     //actually check if there was a result and if there was...
     if(mysqli_num_rows($previousPDF) > 0){

        //use the data to make the pdf
        $doc->save_pdf($previousPDF, FALSE, $author);
        
    }else{
        
        //if not, add it to the database (not, DB has no primary key...)
        $flier->submit_pdf($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos, $summary, $adtnlinfo, $newfilename, $author, $agency, $link);    
        //since it was freshly added, retrieve it and send it to the pdf creator
        $result = $flier->get_bolo();
        $doc->save_pdf($result, FALSE, $author);
        
    }
     
    
    
?>