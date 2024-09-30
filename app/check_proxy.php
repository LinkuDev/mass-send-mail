<?php
if (isset($_POST['proxy'])) {
    $proxy = $_POST['proxy'];

    // Tách proxy ra thành các phần (username, password, host, port)
    $parsedProxy = parse_url($proxy);

    if (!$parsedProxy) {
        echo json_encode(["status" => "dead", "message" => "Invalid proxy format."]);
        exit;
    }

    // Kiểm tra nếu thiếu các phần chính (host và port)
    if (!isset($parsedProxy['host']) || !isset($parsedProxy['port'])) {
        echo json_encode(["status" => "dead", "message" => "Missing host or port in proxy."]);
        exit;
    }

    $ch = curl_init("http://www.example.com"); // URL để kiểm tra proxy
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);  // Thời gian timeout là 10 giây

    // Kiểm tra loại proxy và thiết lập tương ứng
    if (isset($parsedProxy['scheme'])) {
        if ($parsedProxy['scheme'] === 'socks5') {
            curl_setopt($ch, CURLOPT_PROXYTYPE, CURLPROXY_SOCKS5); // Proxy socks5
        } else {
            curl_setopt($ch, CURLOPT_PROXYTYPE, CURLPROXY_HTTP); // Mặc định là HTTP proxy
        }
    } else {
        curl_setopt($ch, CURLOPT_PROXYTYPE, CURLPROXY_HTTP); // Mặc định là HTTP proxy
    }

    // Thiết lập proxy
    curl_setopt($ch, CURLOPT_PROXY, $parsedProxy['host']);
    curl_setopt($ch, CURLOPT_PROXYPORT, $parsedProxy['port']);

    // Nếu proxy có username và password
    if (isset($parsedProxy['user']) && isset($parsedProxy['pass'])) {
        curl_setopt($ch, CURLOPT_PROXYUSERPWD, $parsedProxy['user'] . ':' . $parsedProxy['pass']);
    }

    // Thực hiện yêu cầu
    $result = curl_exec($ch);

    // Kiểm tra lỗi từ curl_exec()
    if ($result === false) {
        $error = curl_error($ch);
        echo json_encode(["status" => "dead", "message" => "cURL error: " . $error]);
    } else {
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($httpCode == 200) {
            echo json_encode(["status" => "live"]);
        } else {
            echo json_encode(["status" => "dead", "http_code" => $httpCode]);
        }
    }

    curl_close($ch);
}
