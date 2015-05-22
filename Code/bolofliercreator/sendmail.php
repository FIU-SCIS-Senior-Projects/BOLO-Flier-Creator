<?php
    //include_once'emailModel.php';
	
	
    //$email=new emailModel();
    //$resultIds = $email->loadIds();
    //$resultEmails = $email->loadEmail();
    $to = "bolo.flyer@gmail.com";
	$subject = "BOLO Alert";
    $message = "Please login in the BOLO website.  There are new Fliers Created";
  
	
  # Send email now
   if( mail( $to, $subject, $message )){
	 echo "Message successfully sent!";
} else {
    echo "Message delivery failed...";
}
?>
