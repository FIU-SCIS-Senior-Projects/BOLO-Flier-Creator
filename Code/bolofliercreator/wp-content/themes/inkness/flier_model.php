<?php

include_once ("connection.php");

class FlierModel {

    public function __construct()
    {

    }
    
    public function submit($selectcat, $myName,$lastName,$dob, $DLnumber,$race,$sex, $height,$weight, $haircolor,$address, $tattoos, $summary, $adtnlinfo,$newfilename,$author,$agency,$link)
    {                  
        $conn=new data_access();
        
         $res = "INSERT INTO wp_flierform (selectcat, myName, lastName, dob, license, race, sex, height, weight, haircolor,address,tattoos,summary,adtnlinfo,image,author,agency,link) 
        VALUES ('$selectcat', '$myName','$lastName','$dob', '$DLnumber', '$race', '$sex', '$height', '$weight', '$haircolor', '$address','$tattoos', '$summary' ,'$adtnlinfo','$newfilename','$author', '$agency', '$link')";
    
             if ($conn->execute_query($res) === TRUE)
        {
            echo "Bolo flier created successfully";         
                            
            
        }else{
            echo "Error:" .$res . "<br> . $conn->error";
                
        }
        //$conn->close();   
    }//end function submit
    
    
    public function getlast()
    {
        $conn=new data_access();
       
      $sql = <<<SQL
            SELECT bolo_id
            FROM `wp_flierform` ORDER BY edit_date DESC LIMIT 1
SQL;
       
      return $conn->execute_query($sql);

    }//end function getlast
    
    /**
     * insert query for the bolo_pdf table
     */
    public function submit_pdf($selectcat, $myName,$lastName,$dob, $DLnumber,$race,$sex, $height,$weight, $haircolor,$address, $tattoos, $summary, $adtnlinfo,$newfilename,$author,$agency,$link){
        
        $conn=new data_access();
        
        $res = "INSERT INTO bolo_pdf (selectcat, myName, lastName, dob, license, race, sex, height, weight, haircolor,address,tattoos,summary,adtnlinfo,image,author,agency,link) 
        VALUES ('$selectcat', '$myName','$lastName','$dob', '$DLnumber', '$race', '$sex', '$height', '$weight', '$haircolor', '$address','$tattoos', '$summary' ,'$adtnlinfo','$newfilename','$author', '$agency', '$link')";
    
            if ($conn->execute_query($res) === TRUE){
            //echo "Bolo flier created successfully";                     
            }
            else{
                //echo "Error:" .$res . "<br> . $conn->error";
            }
        
    }//end function submit_pdf
    
    
        /**
     * delete query for the bolo_pdf table
     */
    public function remove_pdf($selectcat, $myName,$lastName,$dob, $DLnumber,$race,$sex, $height,$weight, $haircolor,$address, $tattoos, $summary, $adtnlinfo, $newfilename, $author, $agency, $link){
        
        $conn=new data_access();
    
        $delete = "DELETE FROM bolo_pdf
        WHERE selectcat='$selectcat' , myName='$myName' , lastName='$lastName', dob='$dob', license='$DLnumber', race='$race', sex='$sex', 
        height='$height', weight='$weight', haircolor='$haircolor',address='$address',tattoos='$tattoos',summary='$summary',
        adtnlinfo='$adtnlinfo',image='$newfilename',author='$author',agency='$agency',link='$link'";
    
        $conn->execute_query($delete);
    }//end function remove_pdf
    
       /**
     * delete query for the wp_flierform table
     */
    public function remove($boloID){
        
        $conn=new data_access();
    
        $delete = "DELETE FROM wp_flierform
        WHERE bolo_id='$boloID'";
    
        $conn->execute_query($delete);
    }//end function remove_pdf
    
    //Gets BOLO for previewing from wp_flierform(NOT THE PDF)
    public function getPreview($selectcat, $myName,$lastName,$dob, $DLnumber,$race,$sex, $height,$weight, $haircolor,$address, $tattoos, $summary, $adtnlinfo,$author,$agency,$link)
    {
        $conn=new data_access();
    
        $previewID = <<<SQL
            SELECT bolo_id
            FROM `wp_flierform`
            WHERE selectcat='$selectcat' , myName='$myName' , lastName='$lastName', dob='$dob', license='$DLnumber', race='$race', sex='$sex', 
            height='$height', weight='$weight', haircolor='$haircolor',address='$address',tattoos='$tattoos',summary='$summary',
            adtnlinfo='$adtnlinfo',author='$author',agency='$agency',link='$link'";
SQL;
       
      return $conn->execute_query($previewID);

    }//end function getPreview
    
        public function submitPreview($selectcat, $myName,$lastName,$dob, $DLnumber,$race,$sex, $height,$weight, $haircolor,$address, $tattoos, $summary,$adtnlinfo,$newfilename,$author,$agency,$link)
    {                  
        $conn=new data_access();
        
         $res = "INSERT INTO wp_flierform (selectcat, myName, lastName, dob, license, race, sex, height, weight, haircolor,address,tattoos,summary,adtnlinfo,image,author,agency,link) 
        VALUES ('$selectcat', '$myName','$lastName','$dob', '$DLnumber', '$race', '$sex', '$height', '$weight', '$haircolor', '$address','$tattoos', '$summary','$adtnlinfo','$newfilename','$author','$agency','$link')";
    
             if ($conn->execute_query($res) === TRUE)
        {
            //echo "Bolo flier created successfully";           
                            
            
        }else{
            echo "Error:" .$res . "<br> . $conn->error";
                
        }
        //$conn->close();   
    }//end function submit
    
    
    
    /**
     * This fuction resturns the bolo that's gonna be converted to a pdf
     */
    public function get_bolo(){
        $conn=new data_access();
        $sql = <<<SQL
        SELECT *
        FROM `bolo_pdf` ORDER BY datecreated DESC LIMIT 1
SQL;
       
      return $conn->execute_query($sql);
    }

}//end class flier_model



?>


  
