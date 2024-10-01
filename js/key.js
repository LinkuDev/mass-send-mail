$(document).ready(function () {
  // Ẩn nội dung trang cho đến khi kiểm tra xong
  $("#content-wrap").hide();

  // Kiểm tra trong localStorage xem đã xác nhận key hợp lệ chưa
  const keyValid = localStorage.getItem("keyValid");

  // Đọc key từ file key.txt trên client
  $.get("key.txt", function (clientKey) {
    // Gửi yêu cầu AJAX đến server để lấy key
    $.ajax({
      url: "http://13.236.161.33:3301/get-key",
      method: "GET",
      success: function (serverKey) {
        console.log(serverKey);
        // So sánh key từ server và client
        if ($.trim(serverKey) === $.trim(clientKey)) {
          // Nếu key hợp lệ, hiển thị nội dung
          $("#content-wrap").show();
          localStorage.setItem("keyValid", "true");
        } else {
          // Nếu key không khớp, hiển thị cảnh báo
          $("#expired-warning").show();
        }
      },
      error: function () {
        // Nếu có lỗi trong request AJAX, hiển thị cảnh báo
        $("#expired-warning").show().text("Khởi tạo thất bại.");
      },
    });
  });
});
