<?php
 
  include_once'emailModel.php';
  include_once'emailView.php';
	//require 'pdfcrowd.php';

	$email=new emailModel();
    $resultIds = $email->loadIds();
    $resultEmails = $email->loadEmail();
	
       while ($row= mysqli_fetch_array($resultEmails))  {
                        $to = $row['user_email'];
						
						
$subject = "BOLO Alert";
$view  =  new Email_View();
$model = new EmailModel();
$data = $model->getlast();

$result = $data->fetch_assoc(); 

$id = $result['bolo_id']; 								
$path= ' <a href="http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1488&idBolo=' . "$id" . '">here</a>';

//$client = new Pdfcrowd("danae", "6e99b84aac21706e182895834ccbb9a3");
//$pdf = $client->convertURI('$path');



$message = "<p>NEW BOLO CREATED. For details click";
$message .= $path . "</p>";  
$message .= "<html><body>";
$message .= "<head> <title>NEW BOLO CREATED</title></head>";
$message .= "<p>To view this document as well as search, sort and view others please log into BOLO Flier Creator at 
http://bolo.cs.fiu.edu/bolofliercreator/.</p>";
$message .= "</body></html>";

 	//header("Content-Type: application/pdf");
    //header("Cache-Control: max-age=0");
    //header("Accept-Ranges: none");
    //header("Content-Disposition: attachment; filename=\"Bolo Details.pdf\"");
  	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
  # Send email now
   if( mail( $to, $subject, $message, $headers )){
	 echo "Message successfull sent!";
} else {
    echo "Message delivery failed...";
}

}


?>


