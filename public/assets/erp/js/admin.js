$(document).ready(function () {
  ("use strict"); // start of use strict

  /*==============================
	Menu
	==============================*/
  $(".header__btn").on("click", function () {
    $(this).toggleClass("header__btn--active");
    $(".header").toggleClass("header--active");
    $(".sidebar").toggleClass("sidebar--active");
  });

  /*==============================
	Filter
	==============================*/
  $(".filter__item-menu li").each(function () {
    $(this).attr("data-value", $(this).text().toLowerCase());
  });

  $(".filter__item-menu li").on("click", function () {
    var text = $(this).text();
    var item = $(this);
    var id = item.closest(".filter").attr("id");
    $("#" + id)
      .find(".filter__item-btn input")
      .val(text);
  });

  /*==============================
	Tabs
	==============================*/
  $(".profile__mobile-tabs-menu li").each(function () {
    $(this).attr("data-value", $(this).text().toLowerCase());
  });

  $(".profile__mobile-tabs-menu li").on("click", function () {
    var text = $(this).text();
    var item = $(this);
    var id = item.closest(".profile__mobile-tabs").attr("id");
    $("#" + id)
      .find(".profile__mobile-tabs-btn input")
      .val(text);
  });

  /*==============================
	Modal
	==============================*/
  $(".open-modal").magnificPopup({
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: "auto",
    type: "inline",
    preloader: false,
    focus: "#username",
    modal: false,
    removalDelay: 300,
    mainClass: "my-mfp-zoom-in",
  });

  $(".modal__btn--dismiss").on("click", function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });

  /*==============================
	Select2
	==============================*/
  $("#quality").select2({
    placeholder: "Choose quality",
    allowClear: true,
  });

  $("#categories").select2({
    placeholder: "Chọn thể loại",
  });

  $("#products").select2({
    placeholder: "Chọn truyện, mangan",
  });

  $("#genre").select2({
    placeholder: " ",
  });

  $("#subscription, #rights").select2();

  /*==============================
	Upload cover
	==============================*/
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $("#form__img").attr("src", e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#form__img-upload").on("change", function () {
    readURL(this);
  });

  /*==============================
	Upload video
	==============================*/
  $(".form__video-upload").on("change", function () {
    var videoLabel = $(this).attr("data-name");

    if ($(this).val() != "") {
      $(videoLabel).text($(this)[0].files[0].name);
    } else {
      $(videoLabel).text("Upload video");
    }
  });

  /*==============================
	Upload gallery
	==============================*/
  $(".form__gallery-upload").on("change", function () {
    var length = $(this).get(0).files.length;
    var galleryLabel = $(this).attr("data-name");

    if (length > 1) {
      $(galleryLabel).text(length + " files selected");
    } else {
      $(galleryLabel).text($(this)[0].files[0].name);
    }
  });

  /*==============================
	Scrollbar
	==============================*/
  var Scrollbar = window.Scrollbar;

  if ($(".sidebar__nav").length) {
    Scrollbar.init(document.querySelector(".sidebar__nav"), {
      damping: 0.1,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
  }

  if ($(".dashbox__table-wrap--1").length) {
    Scrollbar.init(document.querySelector(".dashbox__table-wrap--1"), {
      damping: 0.1,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
  }

  if ($(".dashbox__table-wrap--2").length) {
    Scrollbar.init(document.querySelector(".dashbox__table-wrap--2"), {
      damping: 0.1,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
  }

  if ($(".dashbox__table-wrap--3").length) {
    Scrollbar.init(document.querySelector(".dashbox__table-wrap--3"), {
      damping: 0.1,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
  }

  if ($(".dashbox__table-wrap--4").length) {
    Scrollbar.init(document.querySelector(".dashbox__table-wrap--4"), {
      damping: 0.1,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
  }

  if ($(".main__table-wrap").length) {
    Scrollbar.init(document.querySelector(".main__table-wrap"), {
      damping: 0.1,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
  }

  /*==============================
	Bg
	==============================*/
  $(".section--bg").each(function () {
    if ($(this).attr("data-bg")) {
      $(this).css({
        background: "url(" + $(this).data("bg") + ")",
        "background-position": "center center",
        "background-repeat": "no-repeat",
        "background-size": "cover",
      });
    }
  });

  $("#publishBtn").on("click", function () {
    var name = $("#name").val();
    var title = $("#title").val();
    var slug = $("#slug").val();
    var content = $("#content").val();
    // Thực hiện AJAX request
    $.ajax({
      type: "POST", // Hoặc 'GET' tùy thuộc vào API của bạn
      url: "/erp/categories/created", // Đặt URL của API của bạn ở đây
      data: {
        name: name,
        title: title,
        slug: slug,
        content: content,
      },
      success: function (response) {
        if (response) {
          window.location.href = "/erp/categories";
        }
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });

  $("#editBtn").on("click", function () {
    var uuid = $("#uuid").val();
    var name = $("#name").val();
    var slug = $("#slug").val();
    var content = $("#content").val();
    var title = $("#title").val();

    // Thực hiện AJAX request
    $.ajax({
      type: "PUT", // Hoặc 'GET' tùy thuộc vào API của bạn
      url: "/erp/categories/edited", // Đặt URL của API của bạn ở đây
      data: {
        uuid: uuid,
        name: name,
        slug: slug,
        content: content,
        title: title,
      },
      success: function (response) {
        if (response) {
          window.location.href = "/erp/categories";
        }
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });

  $("#submitProducts").on("click", function () {
    var formData = new FormData();
    var fileInput = $("#form__img-upload")[0];
    var file = fileInput.files[0];
    formData.append("thumb", file);

    // Bổ sung các giá trị khác vào formData
    formData.append("uuid", $("#uuid").val());
    formData.append("name", $("#name").val());
    formData.append("slug", $("#slug").val());
    formData.append("content", $("#content").val());
    formData.append("tags", $("#tags").val());

    var selectedCategories = $("#categories").val();
    var idCategoriesNumbers = selectedCategories.map(function (categoryId) {
      return parseInt(categoryId, 10);
    });

    formData.append("idCategories", JSON.stringify(idCategoriesNumbers));

    // Thực hiện AJAX request
    $.ajax({
      type: "POST",
      url: "http://localhost:4000/erp/products/created",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response) {
          window.location.href = "/erp/products";
        }
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });

  $("#submitProductsEdit").on("click", function () {
    const slug = $("#currentSlug").val();
    var formData = new FormData();
    var fileInput = $("#form__img-upload")[0];
    var file = fileInput.files[0];
    formData.append("thumb", file);
    formData.append("uuid", $("#uuid").val());
    formData.append("name", $("#name").val());
    formData.append("slugEdit", $("#slug").val());
    formData.append("content", $("#content").val());
    formData.append("tags", $("#tags").val());

    var selectedCategories = $("#categories").val();
    var idCategoriesNumbers = selectedCategories.map(function (categoryId) {
      return parseInt(categoryId, 10);
    });
    formData.append("idCategories", JSON.stringify(idCategoriesNumbers));
    $.ajax({
      type: "PUT",
      url: "http://localhost:4000/erp/products/edit/" + slug,
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response) {
          window.location.href = "/erp/products";
        }
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });
  $(".main__table-btn--delete").on("click", function (event) {
    event.preventDefault();
    var itemId = $(this).data("item-id");
    var itemName = $(this).data("item-name");
    $("#modal-delete").addClass("mfp-show");
    $("#modal-delete .modal__title").text(`${itemName}`);
    var confirmation = false;
    $(".modal__btn--apply").on("click", function () {
      $.ajax({
        type: "DELETE",
        url: "/erp/categories/delete/" + itemId,
        success: function (response) {
          console.log("Success:", response);
          $(event.target).closest("tr").remove();
          confirmation = true;
        },
        error: function (error) {
          console.error("Error:", error);
        },
      });
    });

    $(".modal__btn--apply").on("click", function () {
      $.magnificPopup.close();
    });
  });

  //delete chapster
  $(".main__table-btn--deleteChapters").on("click", function (event) {
    event.preventDefault();
    var itemId = $(this).data("item-id");
    var itemName = $(this).data("item-name");
    $("#modal-delete").addClass("mfp-show");
    $("#modal-delete .modal__title").text(`${itemName}`);
    var confirmation = false;
    $(".modal__btn--apply").on("click", function () {
      $.ajax({
        type: "DELETE",
        url: "/erp/chapters/delete/" + itemId,
        success: function (response) {
          console.log("Success:", response);
          $(event.target).closest("tr").remove();
          confirmation = true;
        },
        error: function (error) {
          console.error("Error:", error);
        },
      });
    });

    $(".modal__btn--apply").on("click", function () {
      $.magnificPopup.close();
    });
  });
  // Xử lý sự kiện click nút publish
  $("#uploadChapters").on("click", function () {
    var name = $("#name").val();
    var slug = $("#slug").val();
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    var selectProduct = $("#products").val();
    var idProduct = selectProduct.map(function (productID) {
      return parseInt(productID, 10);
    });
    formData.append("idProducts", Number(idProduct));
    // Lấy danh sách file đã chọn
    var files = $("#fileInput")[0].files;

    // Append từng file vào FormData
    for (var i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    $.ajax({
      url: "http://localhost:4000/upload/create",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log("Upload thành công:", response);
        window.location.href = "/erp/chapters";
      },
      error: function (error) {
        console.error("Lỗi khi upload:", error);
      },
    });
  });
  $("#submitConfigsHome").click(function () {
    // Lấy giá trị từ các trường input
    var title = $("#title").val();
    var keywords = $("#keywords").val();
    var description = $("#description").val();
    var copy = $("#copy").val();
    var tags = $("#tags").val();

    // Gửi dữ liệu đến API bằng Ajax
    $.ajax({
      type: "POST", // hoặc "GET" tùy thuộc vào API của bạn
      url: "/erp/configs/home", // Thay URL_API_CUA_BAN bằng URL thực tế của API
      data: {
        title: title,
        keywords: keywords,
        description: description,
        copy: copy,
        tags: tags,
      },
      success: function (response) {
        // Xử lý phản hồi từ API (nếu cần)
        console.log(response);
        window.location.href = "/erp/configs/home";
      },
      error: function (error) {
        // Xử lý lỗi (nếu có)
        console.error("Error:", error);
      },
    });
  });

  $("#submitConfigFooter").click(function () {
    // Lấy giá trị từ các trường input
    var description = $("#description").val();

    // Gửi dữ liệu đến API bằng Ajax
    $.ajax({
      type: "POST", // hoặc "GET" tùy thuộc vào API của bạn
      url: "/erp/configs/footer", // Thay URL_API_CUA_BAN bằng URL thực tế của API
      data: {
        description: description,
      },
      success: function (response) {
        // Xử lý phản hồi từ API (nếu cần)
        console.log(response);
        window.location.href = "/erp/configs/footer";
      },
      error: function (error) {
        // Xử lý lỗi (nếu có)
        console.error("Error:", error);
      },
    });
  });
});

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  str = str.replace(/ *? /g, "-");
  str = str.trim();
  return str;
}

// Change live input slug
$("input#name").keyup(function () {
  $('input[name="slug"]').val(change_alias($(this).val()));
});
