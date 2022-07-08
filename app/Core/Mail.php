<?php
namespace App\Core; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mail extends PHPMailer{


    public static function sendEmail($args){
        $mail_sent = 0;

        //validation
        if(empty($args['to_email']) || empty($args['subject']) || (empty($args['html_body']) && empty($args['email_body']))){
            return "Email, Subject and Message are required.";
        }

        $to_email = $args['to_email'];
        $to_name = empty($args['to_name']) ? '' : $args['to_name'] ;
        $subject = $args['subject'];
        $html_body = empty($args['html_body']) ? '' : $args['html_body'] ;
        $email_body = empty($args['email_body']) ? '' : $args['email_body'] ;
 
        try{
            $mail = new PHPMailer;

            $mail->SMTPDebug = SMTP::DEBUG_OFF;   
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = MAIL_HOST;							         //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                  //Enable SMTP authentication
            $mail->Username   = MAIL_USERNAME;                     				//SMTP username
            $mail->Password   = MAIL_PASSWORD;                               //SMTP password
            $mail->SMTPSecure = MAIL_ENCRYPTION;         //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
            $mail->Port       = MAIL_PORT;     

            $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
            $mail->addAddress($to_email,$to_name);

            // $mail->addReplyTo('info@example.com', 'Information');
            // $mail->addCC('cc@example.com');
            // $mail->addBCC('bcc@example.com');

            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
           
            $mail->Subject = $subject;

            if(!empty($html_body)) {
                $mail->isHTML(true);
                $mail->AltBody = $email_body;
                $mail->Body    = $html_body;
            } else{
                $mail->Body    = $email_body;
            }

             // added Gmail hack
            $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    )
            );

            if($mail->send()) $mail_sent = 1;
        }
        catch (Exception $e) {
            return "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }

        return $mail_sent;
    }


}

?>