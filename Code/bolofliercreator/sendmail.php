<?php
    //include_once'emailModel.php';
	
	
    //$email=new emailModel();
    //$resultIds = $email->loadIds();
    //$resultEmails = $email->loadEmail();
    $to = "danaetillan@gmail.com";
	$subject = "BOLO Alert";
    $message = "Please login in the BOLo website.  There are new Fliers Created";
  
	
  # Send email now
   if( mail( $to, $subject, $message )){
	 echo "Message successfully sent!";
} else {
    echo "Message delivery failed...";
}
?>
