/*
 * Author: Clarence A Andaya
 * Date: 24 Mar 2022
 */
(function () {
  "use strict";
  var category_id = null;
  var add_sub_cat = false;

  function gotoTab($el_nav, $el_content) {
    $(".tab-wrapper li > a.active").removeClass("active");
    $(".tab-pane").removeClass("show").removeClass("active");

    $el_nav.addClass("active");
    $el_content.addClass("active").addClass("show");
  }

  function readCategoryData() {
    $.ajax({
      url: "/admin/categories/data",
      data: {
        id: category_id,
      },
      type: "GET",
      dataType: "json",
      beforeSend: function () {},
      success: function (result) {
        $("#category_name").val(result.title);
        $("#category_status").val(result.active);
        $("#category_status").prop("checked", parseInt(result.active)),
          $("#btn-add-sub").prop("disabled", false);
      },
      error: function () {
        toastr("error", "Error has occurred. Try again.");
      },
    });
  }

  function formatCategory(state) {
    if (!state.id) {
      return state.text;
    }

    var baseUrl = "/assets/img/logo/AGC_TRANSPARENT.png";
    var $state = $('<span><img class="img-flag" /> <span></span></span>');

    // Use .text() instead of HTML string concatenation to avoid script injection issues
    $state.find("span").text(state.text.replaceAll("¦––", ""));
    //  $state.find("img").attr("src", baseUrl + "/" + state.element.value.toLowerCase() + ".png");

    return $state;
  }

  function updateCategoryTree(data) {
    var v = $("#categories_tree")
      .jstree(true)
      .get_json("#", {
        flat: true,
      })
      .reduce(function (e, t) {
        return e.concat({
          id: t.id,
          parent_id: "#" === t.parent ? null : t.parent,
          position: t.data.position,
        });
      }, []);
    // console.log(v)
    $.ajax({
      url: "/admin/categories/tree",
      data: {
        data: v,
        csrf_token: $("#csrf_token").val(),
      },
      type: "POST",
      dataType: "json",
      beforeSend: function () {},
      success: function (result) {
        // $("#category_name").val(result.title);
        // $("#category_status").val(result.active);
        //  $("#category_status").prop("checked", parseInt(result.active)),
        //   $('#btn-add-sub').prop('disabled',false);
      },
      error: function () {
        toast("error", "Error has occurred. Try again.");
      },
    });
  }

  $(function () {
    "use strict";

    $(".expand-all").on("click", function (t) {
      $("#categories_tree").jstree("open_all");
    });

    $(".collapse-all").on("click", function (t) {
      $("#categories_tree").jstree("close_all");
    });

    $("#btn-add-root").on("click", function (evt) {
      category_id = null;
      resetForm("categoryForm");
      add_sub_cat = false;
      $("#btn_remove").prop("hidden", true);
      $("#btn-add-sub").prop("disabled", true);
      $("#categories_tree").jstree().deselect_all(true);
    });

    $("#btn-add-sub").on("click", function (evt) {
      if (isEmpty(category_id)) {
        return false;
      }
      $("#btn_remove").prop("hidden", true);
      resetForm("categoryForm");
      add_sub_cat = true;
    });

    $("#btn_remove").on("click", function (evt) {
      if (isEmpty(category_id)) {
        return false;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        showClass: {
          backdrop: "swal2-noanimation", // disable backdrop animation
          popup: "", // disable popup animation
          icon: "", // disable icon animation
        },
        hideClass: {
          popup: "", // disable popup fade-out animation
        },
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "/admin/categories/remove",
            data: {
              id: category_id,
              csrf_token: $("#csrf_token").val(),
            },
            type: "POST",
            dataType: "json",
            beforeSend: function () {
              toast("info", "Removing data.");
              $("#btn_remove").prop("disabled", true);
            },
            success: function (result) {
              if (parseInt(result.status) === 1) {
                $("#btn-add-root").trigger("click");
                $("#categories_tree").jstree("refresh");

                $("#btn_remove").prop("disabled", false);

                Swal.fire({
                  icon: "success",
                  title: "Deleted",
                  text: "Your file has been deleted.",
                  showClass: {
                    backdrop: "swal2-noanimation", // disable backdrop animation
                    popup: "", // disable popup animation
                    icon: "", // disable icon animation
                  },
                  hideClass: {
                    popup: "", // disable popup fade-out animation
                  },
                });
              } else {
                toast("error", "Error has occurred. Try again.");
              }
            },
            error: function () {
              toast("error", "Error has occurred. Try again.");

              $("#btn_remove").prop("disabled", false);
            },
          });
        }
      });
    });

    $("#category_status").change(function () {
      if ($(this).is(":checked")) {
        $(this).val("1");
      } else {
        $(this).val("0");
      }
    });

    $.validator.addMethod(
      "first_tab",
      function (value, element, param) {
        if (isEmpty(value)) {
          gotoTab($("#tab-general"), $("#tab-general-content"));
          return false;
        }
        return true;
      },
      "This field is required."
    );

    $.validator.addMethod(
      "second_tab",
      function (value, element, param) {
        if (isEmpty(value)) {
          gotoTab($("#tab-image"), $("#tab-image-content"));
          return false;
        }
        return true;
      },
      "This field is required."
    );

    $.validator.setDefaults({
      submitHandler: function () {
        //  form.submit();
        var json_data = formJson("data-json", $("[data-json]"));
        // alert(category_id);
        // clearInputFields('categoryForm');
        // return;

        if (add_sub_cat || isEmpty(category_id)) {
          $.ajax({
            url: "/admin/categories/add",
            data: {
              id: category_id,
              json_data: json_data,
              csrf_token: $("#csrf_token").val(),
            },
            type: "POST",
            dataType: "json",
            beforeSend: function () {
              toast("info", "Saving data.");
              $("#btn_submit").prop("disabled", true);
            },
            success: function (result) {
              if (parseInt(result.status) === 1) {
                toast("success", result.message);
                resetForm("categoryForm");
                // readCategories
                $("#categories_tree").jstree("refresh");
                removeCloseAlert();
              } else {
                toast("error", result.message);
              }

              $("#btn_submit").prop("disabled", false);
            },
            error: function () {
              toast("error", "Error has occurred. Try again.");

              $("#btn_submit").prop("disabled", false);
            },
          });
        } else {
          $.ajax({
            url: "/admin/categories/update",
            data: {
              id: category_id,
              json_data: json_data,
              csrf_token: $("#csrf_token").val(),
            },
            type: "POST",
            dataType: "json",
            beforeSend: function () {
              toast("info", "Saving data.");
              $("#btn_submit").prop("disabled", true);
            },
            success: function (result) {
              if (parseInt(result.status) === 1) {
                toast("success", result.message);
                // resetForm('categoryForm');
                // readCategories
                $("#categories_tree").jstree("refresh");
                removeCloseAlert();
              } else {
                toast("error", result.message);
              }

              $("#btn_submit").prop("disabled", false);
            },
            error: function () {
              toast("error", "Error has occurred. Try again.");

              $("#btn_submit").prop("disabled", false);
            },
          });
        }
      },
      ignore: [],
    });

    $("#categoryForm").validate({
      rules: {
        category_name: {
          first_tab: true,
        },
      },
      messages: {
        // email: {
        //     required: "Please enter a email address",
        //     email: "Please enter a valid email address"
        // },
        // password: {
        //     required: "Please provide a password",
        //     minlength: "Your password must be at least 5 characters long"
        // },
        // category_name: "Category name is required.",
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".form-group").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid");
      },
    });

    $("#categories_tree")
      .jstree({
        core: {
          data: {
            url: "/admin/categories/list",
            dataType: "json",
          },
          check_callback: !0,
        },
        plugins: ["dnd"],
      })
      .on("move_node.jstree", function (e, data) {
        // this is where you connect to the server!
        updateCategoryTree(data);
        // console.log(data);
        // console.log('Pos: '+data.position);
      });

    $("#categories_tree").on("click", ".jstree-anchor", function (e) {
      category_id = $("#categories_tree").jstree(true).get_node($(this)).id;
      // console.log(category_id)
      add_sub_cat = false;
      $("#btn_remove").prop("hidden", false);
      readCategoryData();
    });

    // //Initialize Select2 Elements
    // $(".select2").select2();

    // $(".select2bs4").select2({
    //   theme: "bootstrap4",
    //   templateSelection: formatCategory,
    // });

    // $("#catalog_description").summernote({
    //   tabsize: 2,
    //   height: 250,
    // });

    // $("#catalog_name").on("click", function () {
    //   if ($("#catalog_description").summernote("isEmpty")) {
    //     //  alert('editor content is empty');
    //   } else {
    //     //summernote codes
    //     var html = $("#catalog_description").summernote("code");
    //     //  alert(html);
    //   }
    // });

    closeAlert("categoryForm");
  });
})();
