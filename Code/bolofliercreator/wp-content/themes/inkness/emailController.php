<?php
 
  include_once'emailModel.php';
  include_once'emailView.php';
	//require 'pdfcrowd.php';

	$email=new emailModel();
    $resultIds = $email->loadIds();
    $resultEmails = $email->loadEmail();
	$receiverEmails = "";
   //TODO: Fix this code speed!!!! 
   while ($row= mysqli_fetch_array($resultEmails))  {
                    $to = $row['user_email'];
        $receiverEmails = $receiverEmails . $to . ", ";
   }
   
   $receivers= rtrim($receiverEmails, ", ");
						
						
$subject = "BOLO Alert";
$view  =  new Email_View();
$model = new EmailModel();
$data = $model->getlast();

$author = $_POST['author'];

$result = $data->fetch_assoc(); 

$id = $result['bolo_id']; 								
$path= ' <a href="http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1488&idBolo=' . "$id" . '">here</a>';

//$client = new Pdfcrowd("danae", "6e99b84aac21706e182895834ccbb9a3");
//$pdf = $client->convertURI('$path');

$file = 'uploads/preview' . $author . '.pdf';
$file_size = filesize($file);
$handle = fopen($file, "r");
$content = fread($handle, $file_size);
fclose($handle);
$content = chunk_split(base64_encode($content));

// a random hash will be necessary to send mixed content
$separator = md5(time());

// carriage return type (we use a PHP end of line constant)
$eol = PHP_EOL;

// main header (multipart mandatory)
$headers = "From: name <bolo.flyer@gmail.com>" . $eol;
$headers .= "MIME-Version: 1.0" . $eol;
$headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol . $eol;
$headers .= "Content-Transfer-Encoding: 7bit" . $eol;
$headers .= "This is a MIME encoded message." . $eol . $eol;

// message
$headers .= "--" . $separator . $eol;
$headers .= "Content-Type: text/plain; charset=\"iso-8859-1\"" . $eol;
$headers .= "Content-Transfer-Encoding: 8bit" . $eol . $eol;
$headers .= $message . $eol . $eol;

// attachment
$headers .= "--" . $separator . $eol;
$headers .= "Content-Type: application/octet-stream; name=\"" . $filename . "\"" . $eol;
$headers .= "Content-Transfer-Encoding: base64" . $eol;
$headers .= "Content-Disposition: attachment" . $eol . $eol;
$headers .= $content . $eol . $eol;
$headers .= "--" . $separator . "--";

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
  	//$headers  = 'MIME-Version: 1.0' . "\r\n";
	//$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
  # Send email now
  mail( $receivers, $subject, $message, $headers );
   // if( mail( $to, $subject, $message, $headers )){
	 // echo "Message successfull sent!";
// } else {
    // echo "Message delivery failed...";
// }

//}


?>

<?php

require_once('class.phpmailer.php');
 
  include_once'emailModel.php';
  include_once'emailView.php';
  
    $email=new emailModel();
    $resultIds = $email->loadIds();
    $resultEmails = $email->loadEmail();
    $receiverEmails = "";
                        
                        
$subject = "BOLO Alert";
$view  =  new Email_View();
$model = new EmailModel();
$data = $model->getlast();

$author = $_POST['author'];

$result = $data->fetch_assoc(); 

$id = $result['bolo_id'];                               
$path= ' <a href="http://bolo.cs.fiu.edu/bolofliercreator/?page_id=1488&idBolo=' . "$id" . '">here</a>';


$file = 'uploads/preview' . $author . '.pdf';
$file_size = filesize($file);


$mail = new PHPMailer(); // defaults to using php "mail()"

//add all email addresses to send to
while ($row= mysqli_fetch_array($resultEmails))  {
                    $to = $row['user_email'];
        $mail->AddAddress($to);
        //$receiverEmails = $receiverEmails . $to . ", ";
   }
   

$message = "<p>NEW BOLO CREATED. For details click";
$message .= $path . "</p>";  
$message .= "<html><body>";
$message .= "<head> <title>NEW BOLO CREATED</title></head>";
$message .= "<p>To view this document as well as search, sort and view others please log into BOLO Flier Creator at 
http://bolo.cs.fiu.edu/bolofliercreator/.</p>";
$message .= "</body></html>";

$mail->From = 'bolo.flyer@gmail.com';
$mail->FromName = 'BOLO Flier Creator';


$mail->Subject    = "BOLO Alert";

$mail->MsgHTML($message);

$mail->AddAttachment($file);      // attachment

$mail->Send();

?>

