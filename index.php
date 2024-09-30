<head>
   <meta charset="utf-8" />
   <title>Email tools</title>
   <meta name="author" content="Erlan Lucio">
   <link rel="icon" href="images/fav.ico" type="image/x-icon" />
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
   <script src="js/custom.js"></script>
   <script src="js/notification.js"></script>
   <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/43.1.1/ckeditor5.css" />
   <link href="styles/bootstrap.css" rel='stylesheet' type='text/css'>
   <link href="styles/animate.css" rel='stylesheet' type='text/css'>
   <link href='styles/notification.css' rel='stylesheet' type='text/css'>
   <link href='styles/main.css' rel='stylesheet' type='text/css'>
   <link rel="stylesheet" href="styles/font-awesome.min.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<style type="text/css">
   * {
      font-family: "Be Vietnam Pro", sans-serif;
   }
   #down{
   margin:30px;
   }
</style>
<div class="animated bounceInDown" id="formulario">
   <table class="display" id="example">
      <center>
      <i style="font-size:180px;" class="fa fa-envelope" aria-hidden="true"></i><br>
      <span style="font-size: 50px;">Gửi mail hàng loạt</span>
      <div class=""  style="margin: 20px 0;">
         <textarea name="conteudo" id="conteudo" placeholder="Nội dung" class="form-control content-email" style="display: none ;max-width: 1600px; min-width: 400px; min-height: 200px; max-height: 200px; text-align: left;" placeholder=""></textarea>
         <div id="editor" >
         </div>
      </div>
      <div class="">
         <textarea name="ccs" id="ccs" placeholder="Email đích" value="nxlinh.19it4@vku.udn.vn" class="form-control list-email" style="max-width: 710px ; min-width: 400px; min-height: 200px; max-height: 200px; text-align: left;" placeholder=""></textarea>
      </div>
      <br>
      <center>
         <div class="form-inline">
            <input value="" type="text" maxlength="30" style="height: 35px; width: 200px; text-align: center;" class="form-control" name="email" id="email" placeholder="Email SMTP">
            <input value="" type="password" maxlength="30" style="height: 35px; width: 150px; text-align: center;" class="form-control" name="senha" id="senha" value="givgokpdpvrrrxaj" placeholder="givgokpdpvrrrxaj">
            <input value="" type="text" maxlength="30" style="height: 35px; width: 150px; text-align: center;" class="form-control" name="port" id="port" value="587" placeholder="587">
            <input value="" type="text" maxlength="30" style="height: 35px; width: 200px; text-align: center;" class="form-control" name="nome" id="nome" placeholder="Tên người gửi">
            <input value="" type="text" maxlength="30" style="height: 35px; width: 150px; text-align: center;" class="form-control" name="assunto" id="assunto" placeholder="Tiêu đề">
         </div>
         <br>
         <span>
            Thông tin:
            <i id="demo">
               <div class="label label-warning label-dismissible">Chưa bắt đầu.</div>
            </i>
            | Đã tải:
            <div id="carregada" class="label label-warning label-dismissible">0</div>
            </i> | Đã gửi:
            <div id="testado" class="label label-warning label-dismissible">0</div>
         </span>
      </center>
</div>
<br>
<div class="form-inline">
    <button type="submit" name="send" value="Bắt đầu" onclick="start()" class="fcbtn btn btn-warning btn-outline btn-1e btn-squared">Bắt đầu</button>
    <button type="submit" name="limpar" value="Xóa" onclick="limpar()" class="fcbtn btn btn-info btn-warning btn-1e btn-squared animated ">Xóa</button>
</table>
<div class="log-history">
    <textarea style="max-width: 710px; margin: 40px auto" class="form-control" placeholder="Kết quả" name="" readonly id="log-content" cols="30" rows="10"></textarea>
</div>
</div>
</div>
<!-- Copyright -->
<div id="down" class="footer-copyright text-center py-3">© 2024 Bản quyền:
    <b>NoName</b>
</div>
<div id="loading" style="display: none;">
    <div class="spinner">
        <!-- Bạn có thể thêm hình ảnh loading hoặc icon spinner tại đây -->
        <img src="images/spinner.gif" alt="Đang tải...">
    </div>
</div>
<div id="loading-check-proxy" style="display: none;">
    <div class="spinner">
        Đang check live toàn bộ proxy trước khi gửi
    </div>
</div>
</div>
<!-- Copyright -->

<!-- Javascript -->
<script type="importmap">
    {
        "imports": {
            "ckeditor5": "https://cdn.ckeditor.com/ckeditor5/43.1.1/ckeditor5.js",
            "ckeditor5/": "https://cdn.ckeditor.com/ckeditor5/43.1.1/"
        }
    }
</script>

<script type="module">
    import {
        ClassicEditor,
        Essentials,
        Bold,
        Italic,
        Font,
        Paragraph,
        SourceEditing,
        Alignment,
        List,
        Link,
        HtmlEmbed
    } from 'ckeditor5';

    let editorInstance;

    // Khởi tạo CKEditor với các plugin mở rộng
    ClassicEditor
        .create(document.querySelector('#editor'), {
            plugins: [
                Essentials, Bold, Italic, Font, Paragraph, 
                SourceEditing, Alignment, List, Link, HtmlEmbed
            ],
            toolbar: [
                'undo', 'redo', '|', 'bold', 'italic', '|',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                'alignment', '|', 'bulletedList', 'numberedList', '|', 
                'link', 'sourceEditing', 'htmlEmbed'
            ],
            htmlEmbed: {
                showPreviews: true // Bật chế độ xem trước cho HTML nhúng
            },
            htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        }

        })
        .then(editor => {
            editorInstance = editor;

            // Lắng nghe sự thay đổi của dữ liệu và cập nhật ngay vào textarea
            editor.model.document.on('change:data', () => {
                document.getElementById('conteudo').value = editorInstance.getData();
            });
        })
        .catch(error => {
            console.error('Error loading CKEditor:', error);
        });
</script>

<style>
   .ck-editor__editable:not(.ck-editor__nested-editable) {
      min-height: 300px;
      }
      .ck-rounded-corners .ck-source-editing-area textarea {
         left: 0;
         min-height: 300px;
      }
</style>

</html>
