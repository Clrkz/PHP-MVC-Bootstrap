/*
 * Author: Clarence A Andaya
 * Date: 24 June 2022
 */

//Only const Variable Here
(function () {
  "use strict";
  //Logic,Variables, Functions Here
  $(document).ready(function () {
    $.validator.setDefaults({
      submitHandler: function () {
        var $form = $("#signinForm")[0];
        var formData = new FormData($form);

        $.ajax({
          url: "/login",
          data: formData,
          type: "POST",
          dataType: "json",
          contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
          processData: false, // NEEDED, DON'T OMIT THIS
          beforeSend: function () {
            toastr.remove();
            toastr.info("Signing in.");
            $("#btn_signin").prop("disabled", true);
          },
          success: function (result) {
            if (parseInt(result.status) === 1) {
              toastr.remove();
              toastr.success(result.message);
              window.location.replace(result.ref);
              // $("#btn_signin").prop("disabled", true); //changeme later
              return false;
            } else {
              toastr.remove();
              toastr.error(result.message);

              $("#btn_signin").prop("disabled", false);
            }
          },
          error: function () {
            toastr.remove();
            toastr.error("Error has occurred. Try again.");

            $("#btn_signin").prop("disabled", false);
          },
        });
      },
    });

    $("#signinForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 5,
        },
        terms: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter a email address",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 5 characters long",
        },
        terms: "Please accept our terms",
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

    $("#toggle_pwd").on("click", function () {
      var $password = $("#txt_password");
      if ($password.prop("type") == "password") {
        $password.prop("type", "text");
        $("#toggle_eye").html('<span class="fas fa-eye-slash"></span>');
      } else {
        $password.prop("type", "password");
        $("#toggle_eye").html('<span class="fas fa-eye" ></span>');
      }
      $password.trigger("focus");
    });

    $("#chk_remember").change(function () {
      if ($(this).is(":checked")) {
        $(this).val("1");
      } else {
        $(this).val("0");
      }
    });
  });
})();
