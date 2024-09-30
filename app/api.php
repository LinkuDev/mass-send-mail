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

            if (strpos($errorMessage, 'Invalid address') !== false) {
                $response['status'] = "error";
                $response['message'] = "Lỗi: Địa chỉ email không hợp lệ.";
            } elseif (strpos($errorMessage, 'SMTP connect() failed') !== false) {
                $response['status'] = "error";
                $response['message'] = "Không thể kết nối tới máy chủ SMTP. Vui lòng kiểm tra thông tin kết nối";
            } elseif (strpos($errorMessage, 'Failed to authenticate') !== false) {
                $response['status'] = "error";
                $response['message'] = "Lỗi: Xác thực thất bại. Kiểm tra lại tên người dùng và mật khẩu email.";
            } elseif (strpos($errorMessage, 'Quota exceeded') !== false) {
                $response['status'] = "quota_exceeded";
                $response['message'] = "Lỗi: Quota email đã vượt quá giới hạn gửi.";
            } elseif (strpos($errorMessage, 'Could not instantiate mail function') !== false) {
                $response['status'] = "error";
                $response['message'] = "Lỗi: Không thể khởi tạo chức năng gửi mail. Vui lòng kiểm tra cấu hình máy chủ.";
            } elseif (strpos($errorMessage, 'SMTP Error: Data not accepted') !== false) {
                $response['status'] = "error";
                $response['message'] = "Lỗi: Máy chủ SMTP không chấp nhận dữ liệu.";
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
