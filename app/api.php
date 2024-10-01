<?php
error_reporting(1);
include_once 'PHPMailer/class.smtp.php';
include_once 'PHPMailer/class.phpmailer.php';

if ($_GET['send'] == "cc") {
    $emails_remetente = $_GET['ccs'];
    $email = $_GET['email'];
    $senha = $_GET['senha'];
    $smtp_port = $_GET['port'];
    $nome_remetente = $_GET['nome'];
    $assunto = $_GET['assunto'];
    $conteudo = $_GET['conteudo'];
    $proxy = $_GET['proxy']; // Proxy từ request, chỉ dùng để in ra

    // Sending the email using PHPMailer class
    $Mailer = new PHPMailer;
    $Mailer->CharSet = "utf8";
    $Mailer->IsSMTP();
    $Mailer->SMTPOptions = array(
        'tls' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true,
        ),
    );
    // Không cần cấu hình proxy cho PHPMailer

    $Mailer->Host = "smtp.gmail.com";
    $Mailer->SMTPAuth = true;
    $Mailer->Username = $email;
    $Mailer->Password = $senha;
    $Mailer->SMTPSecure = "tls";
    $Mailer->Port = $smtp_port;
    $Mailer->FromName = $nome_remetente;
    $Mailer->From = $email;
    $Mailer->AddAddress($emails_remetente);
    $Mailer->IsHTML(true);
    $Mailer->Subject = $assunto;
    $Mailer->Body = $conteudo;

    // Verification and catching errors
    $response = [];
    try {
        if ($Mailer->Send()) {
            $response['status'] = "success";
            // Giả sử $proxy là chuỗi có định dạng 'http://username:password@host:port'
            $proxyHost = parse_url($proxy, PHP_URL_HOST); // Lấy phần host từ proxy
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $response['message'] = "Email: " . $emails_remetente . " | success | " . (empty($proxyHost) ? 'No Proxy' : $proxyHost) . ' | ' . date('Y-m-d H:i:s');
        } else {
            // Kiểm tra các loại lỗi cụ thể và trả về thông báo tiếng Việt
            $errorMessage = $Mailer->ErrorInfo;

            if (strpos($errorMessage, 'Quota exceeded') !== false) {
                $response['status'] = "quota_exceeded";
                $response['message'] = "Lỗi: Quota email đã vượt quá giới hạn gửi.";
            } elseif (strpos($errorMessage, 'SMTP connect() failed') !== false || strpos($errorMessage, 'Failed to authenticate') !== false) {
                $response['status'] = "smtp_error";
                $response['message'] = "Lỗi: Không thể kết nối hoặc xác thực với máy chủ SMTP. Kiểm tra lại cấu hình SMTP";
            } elseif (strpos($errorMessage, 'Invalid address') !== false || strpos($errorMessage, 'SMTP Error: Data not accepted') !== false || strpos($errorMessage, 'Could not instantiate mail function') !== false) {
                $response['status'] = "recipient_error";
                $response['message'] = "Lỗi: Địa chỉ email hoặc dữ liệu không hợp lệ. Vui lòng kiểm tra lại email đích.";
            } else {
                $response['status'] = "error";
                $response['message'] = "Lỗi không xác định: " . $errorMessage;
            }            
        }
    } catch (Exception $e) {
        $response['status'] = "exception";
        $response['message'] = "Ngoại lệ xảy ra: " . $e->getMessage();
    }

    echo json_encode($response);
}
