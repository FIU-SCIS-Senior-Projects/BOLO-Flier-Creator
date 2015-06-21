<?php

    include_once 'flier_model.php';
    include "BoloPDF/bolo_pdf.php";
    
    $tmp_name = $_FILES["picture"]["tmp_name"];
    
    //case a picture is uploaded when creating a bolo
    if($_FILES["picture"]["name"] !== '' ){
        $uploadfilename = $_FILES["picture"]["name"];
    $saveddate = date("mdy-Hms");
    $newfilename = "uploads/".$saveddate."_".$uploadfilename;
    $uploadurl = 'http://'.$_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI']).'/'.$newfilename;
    
    if (move_uploaded_file($tmp_name, $newfilename)):
        $msg = "File uploaded";
    endif; //move uploaded file
    }
    else{// if no pic is uploaded, default to a no image available pic
        $newfilename = "uploads/nopic.png";     
    }
    //get all POST data and save them in variables
    $selectcat=$_POST ['selectcat'];
    $myName=$_POST ['myName']; 
    $lastName=$_POST ['lastName']; 
    $dob=$_POST ['dob'];
    $DLnumber=$_POST ['DLnumber'];
    $race=$_POST ['race'];
    $sex=$_POST ['sex'];
    $height=$_POST ['height'];
    $weight=$_POST ['weight'];
    $haircolor=$_POST ['haircolor'];
    $address=$_POST ['address'];
    $tattoos=$_POST ['tattoos'];
    $adtnlinfo=$_POST ['adtnlinfo'];
    $summary=$_POST ['summary'];
    $author = $_POST['author'];
    $agency = $_POST['agency'];
    $link = $_POST['link'];
    $vcheckboxes= null;
    $rcheckboxes= null;
    $clacheckboxes= null;
    $previousID = $_POST ['previewBOLOid'];
    
    
    //submit data and save it
    $flier = new FlierModel();
    if (isset($previousID))
    {
        $flier->remove($previousID);
    }
    $flier->submitPreview($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $rcheckboxes,$vcheckboxes,$clacheckboxes,$adtnlinfo,$newfilename,$author,$agency,$link);
    //$data = $flier->getPreview($selectcat, $myName, $lastName, $dob, $DLnumber, $race, $sex, $height, $weight, $haircolor, $address, $tattoos,$summary, $rcheckboxes,$vcheckboxes,$clacheckboxes,$adtnlinfo,$newfilename,$author,$agency,$link);
    $data = $flier->getlast();
    $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
    if (stripos($ua, 'android') !== false || stripos($ua, 'iphone') !== false || stripos($ua, 'ipad') !== false) {
        $mobile = TRUE;
    } else {
        $mobile = FALSE;
    }
    $result = $data->fetch_assoc(); 
    $boloID = $result['bolo_id'];
    //$boloID = $data['bolo_id']; 
    $preview_src = "http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=" . $boloID;
    //$preview_src = "http://bolo.cs.fiu.edu/bolofliercreator/wp-content/themes/inkness/BoloSelected.php?idBolo=" . $data;
    //echo "<script>window.location = '$url'      </script>";
    echo json_encode(array('preview_url' => $preview_src, 'mobile' => $mobile, 'boloID' => $boloID), JSON_UNESCAPED_SLASHES);
    //TODO: solve issue with deleting previews after previewing
    //sleep(2);
    //$flier->remove($boloID);

?>