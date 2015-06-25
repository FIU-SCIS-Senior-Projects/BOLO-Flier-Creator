
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

