function notifyMe(_0x6463x2, _0x6463x3, _0x6463x4) {
  if (!("Notification" in window)) {
    alert("Trình duyệt này không hỗ trợ thông báo trên màn hình");
  } else {
    if (Notification.permission === "granted") {
      var _0x6463x5 = {
        body: _0x6463x2,
        icon: "images/logo.png",
        dir: "auto",
      };
      var _0x6463x6 = new Notification(
        "[Email Marketing] " + _0x6463x3,
        _0x6463x5
      );
    } else {
      if (Notification.permission !== "denied") {
        Notification.requestPermission(function (_0x6463x7) {
          if (!("permission" in Notification)) {
            Notification.permission = _0x6463x7;
          }
          if (_0x6463x7 === "granted") {
            var _0x6463x5 = {
              body: _0x6463x4,
              icon: "images/logo.png",
              dir: "auto",
            };
            var _0x6463x6 = new Notification(
              "[Email Marketing] " + _0x6463x3,
              _0x6463x5
            );
          }
        });
      }
    }
  }
}
var audio = new Audio("sound/blop.mp3");
var audio2 = new Audio("sound/bot.mp3");

function limpar() {
  var _0x6463xb = $("#ccs").val();
  if (_0x6463xb.length == 0) {
    document.getElementById("demo").innerHTML =
      '<div class="label label-warning label-dismissible">Hãy tải danh sách trước khi xóa!</div>';
    notifyMe(
      "Chúng tôi không thể xóa thứ gì đó đã được xóa!",
      "Lỗi khi xóa danh sách."
    );
    audio2.play();
    return;
  } else {
    document.getElementById("ccs").value = "";
    document.getElementById("demo").innerHTML =
      '<div class="label label-warning label-dismissible">Danh sách đã được xóa.</div>';
    audio.play();
    notifyMe(
      "Tất cả email trong danh sách của bạn đã được xóa!",
      "Danh sách đã được xóa."
    );
  }
}

function rmLinha(_0x6463xd) {
  var _0x6463xe = $(_0x6463xd).val().split("\n");
  _0x6463xe.splice(0, 1);
  $(_0x6463xd).val(_0x6463xe.join("\n"));
}
var proxyList = [];
var currentProxyIndex = 0;
var liveProxies = [];

// Hàm để đọc file proxy và lưu vào danh sách
function loadProxyList() {
  return new Promise((resolve, reject) => {
    let proxyText = $("#proxy-list").val(); // Lấy nội dung từ textarea có id 'proxy-list'
    console.log("Dữ liệu proxy từ textarea: ", proxyText);

    proxyList = proxyText.trim().split("\n"); // Chia các proxy theo từng dòng
    if (proxyList.length > 0 && proxyList[0] !== "") {
      resolve(proxyList); // Trả về danh sách proxy nếu có dữ liệu
    } else {
      reject("Danh sách proxy trống!");
    }
  });
}

// Hàm để lấy proxy tiếp theo trong danh sách
function getNextProxy() {
  if (liveProxies.length === 0) {
    console.error("Danh sách proxy sống rỗng!");
    return null;
  }
  var proxy = liveProxies[currentProxyIndex];
  currentProxyIndex = (currentProxyIndex + 1) % liveProxies.length;
  console.log("Sử dụng proxy: ", proxy);
  return proxy;
}

// Hàm để kiểm tra proxy có hoạt động không
function checkProxy(proxy) {
  console.log("Đang kiểm tra proxy: ", proxy); // Log proxy đang kiểm tra
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "app/check_proxy.php",
      method: "POST",
      data: { proxy: proxy },
      success: function (response) {
        console.log("Kết quả kiểm tra: ", response); // Log phản hồi từ server

        // Nếu phản hồi là chuỗi, phân tích cú pháp thành đối tượng JSON
        let parsedResponse;
        try {
          parsedResponse =
            typeof response === "string" ? JSON.parse(response) : response;
        } catch (e) {
          console.error("Lỗi phân tích cú pháp phản hồi: ", e);
          resolve(false); // Nếu phân tích cú pháp thất bại, xem như proxy không hoạt động
          return;
        }

        if (parsedResponse.status == "live") {
          resolve(true); // Proxy hoạt động
        } else {
          console.log("Proxy không hoạt động: ", parsedResponse.message); // Log lý do không hoạt động
          resolve(false); // Proxy không hoạt động
        }
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi kiểm tra proxy: ", error); // Log lỗi nếu có
        resolve(false); // Lỗi kết nối, xem như proxy không hoạt động
      },
    });
  });
}

// Hàm để kiểm tra danh sách proxy trước khi gửi email
function checkProxyList() {
  var checkPromises = proxyList.map((proxy) => checkProxy(proxy));
  console.log("Kết quả từ kiểm tra proxy sau khi ajax: ", checkPromises);
  $("#loading-check-proxy").show();

  return Promise.all(checkPromises).then((results) => {
    console.log("Kết quả từ kiểm tra proxy: ", results);
    // Lọc proxy sống
    liveProxies = proxyList.filter((proxy, index) => results[index]);
    console.log("Danh sách proxy hoạt động sau khi lọc: ", liveProxies);

    $("#loading-check-proxy").hide();
    if (liveProxies.length === 0) {
      alert("Không có proxy nào hoạt động!");
      return Promise.reject("Không có proxy hoạt động");
    }
    return liveProxies;
  });
}

// Hàm bắt đầu gửi email
function start() {
  for (var instanceName in CKEDITOR.instances)
    CKEDITOR.instances[instanceName].updateElement();

  var ccs = $("#ccs").val();
  var content = $("#conteudo").val();

  if (ccs.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Bạn cần phải tải một danh sách trước khi bắt đầu!",
      confirmButtonText: "OK",
    });
    return;
  } else if (content === "") {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Thêm nội dung!",
      confirmButtonText: "OK",
    });
    return;
  } else {
    console.log("Bắt đầu gửi email...");
    $("#loading").show();
    $("#progress-container").show(); // Hiển thị thanh progress bar
    $("#progress-text").show(); // Hiển thị text phần trăm
    $("#email-counter").show(); // Hiển thị số lượng email đã gửi/ tổng số email
  }

  loadProxyList()
    .then(() => {
      return checkProxyList();
    })
    .then(() => {
      var emails = ccs.split("\n").filter((email) => email.trim() !== "");
      var logContent = $("#log-content");

      // Hiển thị tổng số email cần gửi
      $("#email-counter").text(`Đã gửi: 0/${emails.length}`);

      // Gửi email đa luồng với số luồng tối đa là 5 và cập nhật tiến độ
      return sendEmailsInParallel(emails, logContent, 5);
    })
    .then(() => {
      // Xử lý khi hoàn tất gửi email
      alert("Quá trình gửi email đã hoàn tất!");
    })
    .catch((error) => {
      console.error("Lỗi khi xử lý: ", error);
      alert("Đã xảy ra lỗi: " + error.message); // Hiển thị thông báo lỗi cho người dùng
    })
    .finally(() => {
      // Ẩn các phần hiển thị nếu có lỗi hoặc quá trình hoàn tất
      $("#loading").hide();
      $("#progress-container").hide(); // Ẩn thanh progress bar
      $("#progress-text").hide(); // Ẩn text phần trăm
      $("#email-counter").hide(); // Ẩn số lượng email
    });
}

function updateProgressBar(completedEmails, totalEmails) {
  var progressPercentage = Math.round((completedEmails / totalEmails) * 100);
  $("#progress-bar")
    .css("width", progressPercentage + "%")
    .text(progressPercentage + "%");
  $("#progress-text").text(progressPercentage + "%");

  // Cập nhật số lượng email đã gửi được
  $("#email-counter").text(`Đã gửi: ${completedEmails}/${totalEmails}`);
}

function sendEmailsInParallel(emails, logContent) {
  var totalEmails = emails.length;
  var completedEmails = 0;
  var hasCriticalError = false;
  var delayBetweenRequests = 1000; // Giới hạn 1 request mỗi giây (1000ms = 1 giây)
  var maxRequestsPerMinute = 60;
  var activePromises = 0;
  var currentIndex = 0;

  // Cập nhật thanh tiến trình
  function updateProgressBar() {
    completedEmails++;
    var progressPercentage = Math.round((completedEmails / totalEmails) * 100);
    $("#progress-bar").css("width", progressPercentage + "%");
    $("#progress-text").text(progressPercentage + "%");
  }

  return new Promise((resolve, reject) => {
    function next() {
      if (hasCriticalError || currentIndex >= totalEmails) {
        if (activePromises === 0) {
          resolve(); // Hoàn thành khi tất cả email đã được xử lý
        }
        return;
      }

      // Chỉ gửi tiếp nếu còn email chưa xử lý
      if (currentIndex < totalEmails) {
        let email = emails[currentIndex++];

        // Tạo khoảng thời gian giãn cách giữa các request
        setTimeout(() => {
          activePromises++;
          check(email, currentIndex, logContent)
            .then(() => {
              updateProgressBar();
              activePromises--;
              next();
            })
            .catch((error) => {
              if (error.isCritical) {
                hasCriticalError = true;
                reject(error);
              } else {
                updateProgressBar();
                activePromises--;
                next();
              }
            });
        }, delayBetweenRequests);
      }
    }

    // Sử dụng setInterval để gửi các request cách nhau 1 giây, giới hạn 60 request/phút
    var intervalId = setInterval(() => {
      if (currentIndex >= totalEmails) {
        clearInterval(intervalId); // Dừng interval khi tất cả email đã được xử lý
      }
      if (activePromises < maxRequestsPerMinute) {
        next();
      }
    }, delayBetweenRequests);
  });
}

// Hàm kiểm tra và gửi email với proxy
// Khởi tạo biến đếm bên ngoài hàm
var successCount = 0;
var failedCount = 0;

function check(email, index, logContent) {
  var emailInput = $("#email").val();
  var senha = $("#senha").val();
  var nome = $("#nome").val();
  var port = $("#port").val();
  var assunto = $("#assunto").val();
  var conteudo = $("#conteudo").val();

  var proxy = getNextProxy();

  return new Promise((resolve, reject) => {
    setTimeout(function () {
      $.ajax({
        type: "GET",
        url: "app/api.php",
        dataType: "json",
        data: {
          send: "cc",
          ccs: email,
          email: emailInput,
          port: port,
          senha: senha,
          nome: nome,
          assunto: assunto,
          conteudo: conteudo,
          proxy: proxy,
        },
        success: function (response) {
          // Chuyển response thành đối tượng nếu nó đang là chuỗi
          let responseObject;
          if (typeof response === "string") {
            try {
              responseObject = JSON.parse(response); // Chuyển chuỗi JSON thành đối tượng
            } catch (e) {
              logContent.append("Lỗi chuyển đổi JSON: " + e.message + "\n");
              reject("Lỗi chuyển đổi JSON");
              return;
            }
          } else {
            responseObject = response; // Nếu đã là đối tượng, không cần chuyển đổi
          }

          // Kiểm tra trạng thái và xử lý tương ứng
          if (responseObject.status === "success") {
            logContent.append(responseObject.message + "\n");
            successCount++; // Tăng biến đếm thành công
          } else if (responseObject.status === "quota_exceeded") {
            Swal.fire({
              icon: "error",
              title: "Lỗi Quota",
              text: "Quota email đã vượt quá giới hạn!",
            }).then(() => {
              $("#loading").hide();
              $("#progress-container").hide(); // Ẩn thanh progress bar
              $("#progress-text").hide(); // Ẩn text phần trăm
              $("#email-counter").hide(); // Ẩn số lượng email
              reject({
                message: "Quota exceeded, stopping further requests.",
                isCritical: true,
              });
            });
            return;
          } else if (responseObject.status === "smtp_error") {
            Swal.fire({
              icon: "error",
              title: "Lỗi SMTP",
              text: "Không thể kết nối hoặc xác thực với máy chủ SMTP! \n Kiểm tra thông tin SMTP",
            }).then(() => {
              $("#loading").hide();
              $("#progress-container").hide(); // Ẩn thanh progress bar
              $("#progress-text").hide(); // Ẩn text phần trăm
              $("#email-counter").hide(); // Ẩn số lượng email
              reject({ message: responseObject.message, isCritical: true });
            });
            return;
          } else if (responseObject.status === "recipient_error") {
            Swal.fire({
              icon: "error",
              title: "Lỗi Email",
              text: "Địa chỉ email hoặc dữ liệu không hợp lệ!",
            }).then(() => {
              $("#loading").hide();
              $("#progress-container").hide(); // Ẩn thanh progress bar
              $("#progress-text").hide(); // Ẩn text phần trăm
              $("#email-counter").hide(); // Ẩn số lượng email
              reject({
                message:
                  "Invalid recipient or data, stopping further requests.",
                isCritical: true,
              });
            });
            return;
          } else {
            logContent.append("Lỗi: " + responseObject.message + "\n");
            failedCount++; // Tăng biến đếm thất bại
          }

          // Cập nhật số lượng email gửi thành công và thất bại
          $("#success-total").text(successCount);
          $("#failed-total").text(failedCount);

          // Loại bỏ email đã xử lý khỏi textarea ccs
          var ccsTextArea = $("#ccs");
          var currentCcs = ccsTextArea.val().split("\n");
          currentCcs = currentCcs.filter((line) => line.trim() !== email); // Loại bỏ dòng chứa email
          ccsTextArea.val(currentCcs.join("\n")); // Cập nhật lại nội dung textarea ccs

          resolve(); // Tiếp tục xử lý nếu không có lỗi nghiêm trọng
        },
        error: function (xhr, status, error) {
          logContent.append("Lỗi không xác định: " + error + "\n");
          failedCount++; // Tăng biến đếm thất bại

          // Cập nhật số lượng email gửi thành công và thất bại
          $("#success-total").text(successCount);
          $("#failed-total").text(failedCount);

          resolve(); // Tiếp tục với email tiếp theo, không dừng do lỗi không nghiêm trọng
        },
      });
    }, index * 50); // Giãn cách giữa các yêu cầu
  });
}

function SelectAll(_0x6463xd) {
  document.getElementById(_0x6463xd).focus();
  document.getElementById(_0x6463xd).select();
}

function listToArray(_0x6463x25, _0x6463x26) {
  var _0x6463x27 = [];
  if (_0x6463x25 !== undefined) {
    if (_0x6463x25.indexOf(_0x6463x26) == -1) {
      _0x6463x27.push(_0x6463x25);
    } else {
      _0x6463x27 = _0x6463x25.split(_0x6463x26);
    }
  }
  return _0x6463x27;
}

function count(_0x6463x29, _0x6463x2a) {
  var _0x6463x2b,
    _0x6463x2c = 0;
  if (_0x6463x29 === null || typeof _0x6463x29 === "undefined") {
    return 0;
  } else {
    if (_0x6463x29.constructor !== Array && _0x6463x29.constructor !== Object) {
      return 1;
    }
  }
  if (_0x6463x2a === "COUNT_RECURSIVE") {
    _0x6463x2a = 1;
  }
  if (_0x6463x2a != 1) {
    _0x6463x2a = 0;
  }
  for (_0x6463x2b in _0x6463x29) {
    if (_0x6463x29.hasOwnProperty(_0x6463x2b)) {
      _0x6463x2c++;
      if (
        _0x6463x2a == 1 &&
        _0x6463x29[_0x6463x2b] &&
        (_0x6463x29[_0x6463x2b].constructor === Array ||
          _0x6463x29[_0x6463x2b].constructor === Object)
      ) {
        _0x6463x2c += this.count(_0x6463x29[_0x6463x2b], 1);
      }
    }
  }
  return _0x6463x2c;
}

function pushcsB(_0x6463x2e, _0x6463x2f) {
  document.getElementById(_0x6463x2f).innerHTML =
    document.getElementById(_0x6463x2f).innerHTML + _0x6463x2e + "\n<br>";
}
