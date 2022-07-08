/*
 * Author: Clarence A Andaya
 * Date: 31 Mar 2022
 */

//Only const Variable Here
(function () {
  "use strict";
  //Logic,Variables, Functions Here
  var variation_list = [];
  var variation_images = [];
  var product_images = [];
  var variation_attributes = [];
  var selected_variation_key = null;

  var myDzProductPhotos = null;
  var myDzProductMainPhotos = null;
  var myVariationList = null;
  // Global default options
  Dropzone.autoDiscover = false;

  var selected_attributes = [];

  function dzProductPhotos() {
    myDzProductPhotos = new Dropzone("#dz_product_photo", {
      url: "/admin/storage/upload", // If not using a form element
      acceptedFiles: ".png,.jpg,.jpeg,.gif", //allowed filetypes
      maxFilesize: 8,
      maxFiles: 20,
      clickable: true,
      addRemoveLinks: true,
      dictCancelUpload: "",
      removedfile: function (file) {
        //  console.log(file);
        if (selected_variation_key != null) {
          //  load images
          //remove in varialist image array
          $.each(
            variation_list[selected_variation_key].images,
            function (i, v) {
              if (v.id == file.id) {
                delete variation_list[selected_variation_key].images[i];
                // clean and refresh variations attributes
                variation_list[selected_variation_key].images = filterArray(
                  variation_list[selected_variation_key].images
                );
              }
            }
          );

          //remove in current variation_images array only for already uploaded image (mock image)
          $.each(variation_images, function (k, j) {
            if (j.id == file.id) {
              delete variation_images[k];
              variation_images = filterArray(variation_images);
            }
          });
        }
        if (typeof file.upload != "undefined") {
          $.each(variation_images, function (k, j) {
            //  console.log(j.uuid + ' ' + file.upload.uuid);
            if (j.uuid == file.upload.uuid) {
              delete variation_images[k];
              variation_images = filterArray(variation_images);
            }
          });
        }

        //remove in variation_images array only for newly upload

        //  $.ajax({
        //      type: 'POST',
        //      url: '/admin/storage/remove',
        //      dataType: 'json',
        //      data: {
        //          id_or_name: file.upload.filename,
        //          dir: "products",
        //          csrf_token: $('#csrf_token').val()
        //      },
        //      sucess: function(data) {
        //          console.log('success: ' + data);
        //      }
        //  });

        var _ref;
        return (_ref = file.previewElement) != null
          ? _ref.parentNode.removeChild(file.previewElement)
          : void 0;
      },
      init: function () {
        this.on("maxfilesexceeded", function (file) {
          // $("#proceed-button-vehicle").attr("disabled", false);
          toast("error", "Only 20 images.");
          $("#btn_save_variation").prop("disabled", false);
          return 0;
        });
        this.on("error", function (file) {
          toast("error", "Error has occured.");
          $("#btn_save_variation").prop("disabled", false);
          return;
        });
        this.on("success", function (file, response) {
          if (response.status == 0) {
            toast("error", response.message);
            return false;
          }
          variation_images.push({
            uuid: file.upload.uuid,
            id: response.id,
            path: response.path,
            size: response.size,
            name: response.name,
          });

          $("#btn_save_variation").prop("disabled", false);
          //  console.log(variation_images);
        });
        this.on("sending", function (file, xhr, formData) {
          formData.append("dir", "products");
          formData.append("csrf_token", $("#csrf_token").val());
        });
        this.on("addedfiles", function (files) {
          $("#btn_save_variation").prop("disabled", true);
        });
      },
    });
  }

  function dzProductPhotosMain() {
    myDzProductMainPhotos = new Dropzone("#catalog_dz_product_photo", {
      url: "/admin/storage/upload", // If not using a form element
      acceptedFiles: ".png,.jpg,.jpeg,.gif", //allowed filetypes
      maxFilesize: 8,
      maxFiles: 3,
      clickable: true,
      addRemoveLinks: true,
      dictCancelUpload: "",
      removedfile: function (file) {
        //  console.log(file);

        if (typeof file.upload != "undefined") {
          $.each(product_images, function (k, j) {
            if (j.uuid == file.upload.uuid) {
              delete product_images[k];
              product_images = filterArray(product_images);
            }
          });
        } else {
          //remove in current product_images array only for already uploaded image (mock image)
          $.each(product_images, function (k, j) {
            if (j.id == file.id) {
              delete product_images[k];
              product_images = filterArray(product_images);
            }
          });
        }

        var _ref;
        return (_ref = file.previewElement) != null
          ? _ref.parentNode.removeChild(file.previewElement)
          : void 0;
      },
      init: function () {
        this.on("maxfilesexceeded", function (file) {
          // $("#proceed-button-vehicle").attr("disabled", false);
          toast("error", "Only 20 images.");
          $("#btn_save_product").prop("disabled", false);
          return 0;
        });
        this.on("error", function (file) {
          toast("error", "Error has occured.");
          $("#btn_save_product").prop("disabled", false);
          return;
        });
        this.on("success", function (file, response) {
          if (response.status == 0) {
            toast("error", response.message);
            return false;
          }
          product_images.push({
            uuid: file.upload.uuid,
            id: response.id,
            path: response.path,
            size: response.size,
            name: response.name,
          });

          $("#btn_save_product").prop("disabled", false);
        });
        this.on("sending", function (file, xhr, formData) {
          formData.append("dir", "products");
          formData.append("csrf_token", $("#csrf_token").val());
        });
        this.on("addedfiles", function (files) {
          $("#btn_save_product").prop("disabled", true);
        });
      },
    });
  }

  function isDuplicateObject(object1, object2, key) {
    var uniqueResultOne = object1.filter(function (obj) {
      return !object2.some(function (obj2) {
        return obj[key] == obj2[key];
      });
    });

    //Find values that are in obj2 but not in obj1
    var uniqueResultTwo = object2.filter(function (obj) {
      return !object1.some(function (obj2) {
        return obj[key] == obj2[key];
      });
    });

    //Combine the two arrays of unique entries
    var result = uniqueResultOne.concat(uniqueResultTwo);

    if (result.length) {
      return false;
    } else {
      return true;
    }
  }

  function isBelowZero($el, msg, focus = true) {
    if ($el.val() != "") {
      if (parseInt($el.val()) < 0) {
        toast("error", msg);
        if (focus) {
          $el.trigger("focus");
        }
        return true;
      }
    }
    return false;
  }

  function isBelowN($el, msg, num, focus = true) {
    if ($el.val() != "") {
      if (parseInt($el.val()) < num) {
        toast("error", msg);
        if (focus) {
          $el.trigger("focus");
        }
        return true;
      }
    }
    return false;
  }

  function checkDuplicateVariation() {
    var isDuplicateVariation = false;
    $.each(variation_list, function (i, v) {
      var result1 = JSON.parse(JSON.stringify(v.attributes));
      $.each(variation_list, function (j, k) {
        if (i == j) {
          return;
        }
        var result2 = JSON.parse(JSON.stringify(k.attributes));

        if (isDuplicateObject(result1, result2, "child_id")) {
          isDuplicateVariation = true;
        }
      });
    });
    return isDuplicateVariation;
  }
  function checkDuplicateAddVariation() {
    var isDuplicateVariation = false;
    var result1 = JSON.parse(JSON.stringify(variation_attributes));
    $.each(variation_list, function (i, v) {
      if (selected_variation_key != null) {
        if (i == selected_variation_key) {
          return;
        }
      }

      var result2 = JSON.parse(JSON.stringify(v.attributes));

      if (isDuplicateObject(result1, result2, "child_id")) {
        isDuplicateVariation = true;
      }
    });

    return isDuplicateVariation;
  }
  function variationForm() {
    //clean attributes array (remove empty elements)
    var filtered = filterArray(selected_attributes);

    if (!filtered.length) {
      toast("error", "No attributes selected.");
      return false;
    }

    //ajax calling the variation form

    $.ajax({
      url: "/admin/products/variation",
      data: {
        attributes: filtered,
        csrf_token: $("#csrf_token").val(),
      },
      type: "GET",
      dataType: "json",
      beforeSend: function () {
        variation_images = [];
        variation_attributes = [];
        $(".modal_container").empty();
        $("#btn_add_variation").prop("disabled", true);
      },
      success: function (result) {
        $(".modal_container").html(result.data);

        //show variant form
        $("#modal_variation").modal("show");

        //fill data to form if is update
        if (selected_variation_key != null) {
          // console.log(variation_list[selected_variation_key]);
          //load fields
          $.each(variation_list[selected_variation_key], function (i, v) {
            if (!Array.isArray(v)) {
              // alert('input[name="' + i + '"]');
              $('input[name="' + i + '"]').val(v);
            }
          });

          //load locations
          var prod_loc = variation_list[selected_variation_key];
          if (typeof prod_loc.warehouse != "undefined") {
            var whOption = new Option(
              prod_loc.warehouse.title,
              prod_loc.warehouse.id,
              true,
              true
            );
            $('select[name="warehouse"]').append(whOption).trigger("change");
          }
          if (typeof prod_loc.floor != "undefined") {
            var whOption = new Option(
              prod_loc.floor.title,
              prod_loc.floor.id,
              true,
              true
            );
            $('select[name="floor"]').append(whOption).trigger("change");
          }
          if (typeof prod_loc.rack != "undefined") {
            var whOption = new Option(
              prod_loc.rack.title,
              prod_loc.rack.id,
              true,
              true
            );
            $('select[name="rack"]').append(whOption).trigger("change");
          }
          if (typeof prod_loc.bin != "undefined") {
            var whOption = new Option(
              prod_loc.bin.title,
              prod_loc.bin.id,
              true,
              true
            );
            $('select[name="bin"]').append(whOption).trigger("change");
          }

          //load attributes
          $.each(
            variation_list[selected_variation_key].attributes,
            function (i, v) {
              $(
                'select[name="attribute-' + v.parent_name.toLowerCase() + '"]'
              ).val(v.child_id);
            }
          );
        }

        //Initialze dropzone
        // dzProductPhotos("#dz_product_photo");
        dzProductPhotos();

        //load images
        if (selected_variation_key != null) {
          //  load images
          $.each(
            variation_list[selected_variation_key].images,
            function (i, v) {
              variation_images.push({
                id: v.id,
                path: v.path,
                size: v.size,
                name: v.name,
              });

              var mockFile = {
                id: v.id,
                name: v.name, //v.path,
                size: v.size, //'12345' //v.unreadable_size
              };

              myDzProductPhotos.emit("addedfile", mockFile);
              myDzProductPhotos.emit("complete", mockFile);
              myDzProductPhotos.emit(
                "thumbnail",
                mockFile,
                APP_DISK + "thumbnails/" + v.path
              );
              myDzProductPhotos.files.push(mockFile); // here you add them into the files array
            }
          );
        }

        //initialize datepicker
        $(".datetimepicker").datetimepicker({
          format: "MM/DD/YYYY hh:mm A",
          // minDate: moment().subtract(1, "day"),
        });
        //  $("[data-mask]").inputmask();

        //init product location warehouse,floor,rack,bin
        $('select[name="warehouse"]').select2({
          theme: "bootstrap4",
          language: {
            noResults: function () {
              return "Select store and enter warehouse name.";
            },
          },
          escapeMarkup: function (markup) {
            return markup;
          },
          placeholder: "Please Select",
          ajax: {
            url: "/admin/inventory/locations",
            dataType: "json",
            delay: 250,
            data: function (data) {
              return {
                search: data.term,
                limit: 15,
                store_id: $('select[name="catalog_store"]').val(),
              };
            },
            processResults: function (response) {
              return {
                results: response,
              };
            },
            cache: true,
          },
        });

        $('select[name="floor"]').select2({
          theme: "bootstrap4",
          language: {
            noResults: function () {
              return "Select warehouse and enter floor name.";
            },
          },
          escapeMarkup: function (markup) {
            return markup;
          },
          placeholder: "Please Select",
          ajax: {
            url: "/admin/inventory/locations",
            dataType: "json",
            delay: 250,
            data: function (data) {
              return {
                search: data.term,
                limit: 15,
                parent_id: $('select[name="warehouse"]').val(),
                type: "floor",
              };
            },
            processResults: function (response) {
              return {
                results: response,
              };
            },
            cache: true,
          },
        });

        $('select[name="rack"]').select2({
          theme: "bootstrap4",
          language: {
            noResults: function () {
              return "Select floor and enter rack name.";
            },
          },
          escapeMarkup: function (markup) {
            return markup;
          },
          placeholder: "Please Select",
          ajax: {
            url: "/admin/inventory/locations",
            dataType: "json",
            delay: 250,
            data: function (data) {
              return {
                search: data.term,
                limit: 15,
                parent_id: $('select[name="floor"]').val(),
                type: "rack",
              };
            },
            processResults: function (response) {
              return {
                results: response,
              };
            },
            cache: true,
          },
        });

        $('select[name="bin"]').select2({
          theme: "bootstrap4",
          language: {
            noResults: function () {
              return "Select floor and enter bin name.";
            },
          },
          escapeMarkup: function (markup) {
            return markup;
          },
          placeholder: "Please Select",
          ajax: {
            url: "/admin/inventory/locations",
            dataType: "json",
            delay: 250,
            data: function (data) {
              return {
                search: data.term,
                limit: 15,
                parent_id: $('select[name="rack"]').val(),
                type: "bin",
              };
            },
            processResults: function (response) {
              return {
                results: response,
              };
            },
            cache: true,
          },
        });

        $('select[name="warehouse"]').on("change", function () {
          $('select[name="floor"]').val(null).trigger("change");
        });

        $('select[name="floor"]').on("change", function () {
          $('select[name="rack"]').val(null).trigger("change");
        });

        $('select[name="rack"]').on("change", function () {
          $('select[name="bin"]').val(null).trigger("change");
        });

        $("#modal_variation").on("hidden.bs.modal", function () {
          //destroy all elements in modal
          //  myDzProductPhotos.destroy();
          myDzProductPhotos.files = [];
          $(this).remove();
        });

        $("#btn_add_variation").prop("disabled", false);

        $("#btn_save_variation").on("click", function () {
          //validations
          if ($('input[name="price"]').val() == "") {
            toast("error", "Price cannot be empty.");
            $('input[name="price"]').trigger("focus");
            return false;
          }

          if (
            isBelowN(
              $('input[name="price"]'),
              "Price cannot be negative value.",
              0
            )
          ) {
            return false;
          }

          if (
            isBelowN(
              $('input[name="min_order_qty"]'),
              "Minimum order quantity must be equal or greater than 1",
              1
            )
          ) {
            return false;
          }
          if (
            isBelowN(
              $('input[name="max_order_qty"]'),
              "Maximum order quantity must be equal or greater than 1",
              1
            )
          ) {
            return false;
          }

          if (
            isBelowN(
              $('input[name="sale_price"]'),
              "Sale price cannot be negative value.",
              0
            )
          ) {
            return false;
          }

          if (
            isBelowN(
              $('input[name="quantity"]'),
              "Quantity price cannot be negative value.",
              0
            )
          ) {
            return false;
          }

          if (
            isBelowN(
              $('input[name="max_quantity"]'),
              "Max quantity price cannot be negative value.",
              0
            )
          ) {
            return false;
          }

          if (
            isBelowN(
              $('input[name="order_quantity"]'),
              "Order quantity price cannot be negative value.",
              0
            )
          ) {
            return false;
          }

          var is_empty_attr = false;
          $("[data-attribute]").each(function () {
            if (!$(this).val()) {
              $(this).trigger("focus");
              is_empty_attr = true;
              return false;
            }
          });

          if (is_empty_attr) {
            toast("error", "Invalid attribute value.");
            return false;
          }

          //sales price validation
          if (
            ($("#sale_price_start").val() && !$("#sale_price_end").val()) ||
            (!$("#sale_price_start").val() && $("#sale_price_end").val()) ||
            moment($("#sale_price_start").val()) >=
              moment($("#sale_price_end").val())
          ) {
            toast("error", "Invalid sale date range.");
            $("#sale_price_start").trigger("focus");
            return false;
          }

          if (
            ($("#sale_price_start").val() &&
              !$('input[name="sale_price"]').val()) ||
            ($("#sale_price_end").val() && !$('input[name="sale_price"]').val())
          ) {
            toast("error", "Sale price cannot be empty.");
            $('input[name="sale_price"]').trigger("focus");
            return false;
          }

          if (
            parseInt($('input[name="price"]').val()) <=
            parseInt($('input[name="sale_price"]').val())
          ) {
            toast("error", "Sale price must not greater or equal than price.");
            $('input[name="sale_price"]').trigger("focus");
            return false;
          }
          if ($('input[name="max_order_qty"]').val() != "") {
            if (
              parseInt($('input[name="max_order_qty"]').val()) <
              parseInt($('input[name="min_order_qty"]').val())
            ) {
              toast(
                "error",
                "Minimum order quantity must not greater than max order quantity."
              );
              $('input[name="min_order_qty"]').trigger("focus");
              return false;
            }
          }
          if ($('input[name="max_quantity"]').val() != "") {
            //deprecated
            // if (
            //   parseInt($('input[name="max_quantity"]').val()) <
            //   parseInt($('input[name="min_order_qty"]').val())
            // ) {
            //   toast(
            //     "error",
            //     "Minimum order quantity must not greater than max quantity."
            //   );
            //   $('input[name="min_order_qty"]').trigger("focus");
            //   return false;
            // }

            // if (
            //   parseInt($('input[name="max_quantity"]').val()) <
            //   parseInt($('input[name="max_order_qty"]').val())
            // ) {
            //   toast(
            //     "error",
            //     "Maximum order quantity must not greater than max quantity."
            //   );
            //   $('input[name="max_order_qty"]').trigger("focus");
            //   return false;
            // }

            if (
              parseInt($('input[name="max_quantity"]').val()) <
              parseInt($('input[name="quantity"]').val())
            ) {
              toast("error", "Quantity must not greater than max quantity.");
              $('input[name="quantity"]').trigger("focus");
              return false;
            }

            if (
              parseInt($('input[name="max_quantity"]').val()) <
              parseInt($('input[name="order_quantity"]').val())
            ) {
              toast(
                "error",
                "Order quantity must not greater than max quantity."
              );
              $('input[name="order_quantity"]').trigger("focus");
              return false;
            }
          }

          variation_attributes = [];
          var obj_data = formObj("data-obj", $("[data-obj]"));
          // console.log(obj_data);
          // return false;
          // Add Locations
          if (parseInt($('select[name="warehouse"]').val())) {
            obj_data["warehouse"] = {
              id: $('select[name="warehouse"]').val(),
              title: $('select[name="warehouse"] option:selected').text(),
              type: "wh",
            };
          }
          if (parseInt($('select[name="floor"]').val())) {
            obj_data["floor"] = {
              id: $('select[name="floor"]').val(),
              title: $('select[name="floor"] option:selected').text(),
              type: "floor",
            };
          }
          if (parseInt($('select[name="rack"]').val())) {
            obj_data["rack"] = {
              id: $('select[name="rack"]').val(),
              title: $('select[name="rack"] option:selected').text(),
              type: "rack",
            };
          }
          if (parseInt($('select[name="bin"]').val())) {
            obj_data["bin"] = {
              id: $('select[name="bin"]').val(),
              title: $('select[name="bin"] option:selected').text(),
              type: "bin",
            };
          }

          //Add attributes to variation
          $("[data-attribute]").each(function () {
            var attr_obj = {
              parent_id: parseInt($(this).attr("data-id")),
              parent_name: $(this).attr("data-name"),
              child_id: $(this).val(),
              child_name: $("option:selected", this).text(),
            };
            variation_attributes.push(attr_obj);
          });

          //Legacy code for checking if attributes is exist
          //  //start check if variations has equal attributes
          //  $.each(variation_list, function(i, v) {
          //      //  console.log('error');

          //      var result1 = JSON.parse(JSON.stringify(variation_attributes));
          //      var result2 = JSON.parse(JSON.stringify(v.attributes));

          //      if (result1.length != result2.length) {

          //          var uniqueResultOne = result1.filter(function(obj) {
          //              return !result2.some(function(obj2) {
          //                  return obj.parent_id == obj2.parent_id;
          //              });
          //          });

          //          //Find values that are in result2 but not in result1
          //          var uniqueResultTwo = result2.filter(function(obj) {
          //              return !result1.some(function(obj2) {
          //                  return obj.parent_id == obj2.parent_id;
          //              });
          //          });

          //          //Combine the two arrays of unique entries
          //          var result = JSON.parse(JSON.stringify(uniqueResultOne)); //uniqueResultOne.concat(uniqueResultTwo);
          //          result[0].child_id = '';
          //          result[0].child_name = '';

          //          console.log('added');
          //          $.each(result, function(k, j) {
          //              variation_list[i].attributes.push(j);
          //          });
          //      }

          //  });

          //start check duplicate variations
          // var isDuplicateVariation = false;
          // $.each(variation_list, function (i, v) {
          //   if (selected_variation_key != null) {
          //     if (i == selected_variation_key) {
          //       return;
          //     }
          //   }
          //   var result1 = JSON.parse(JSON.stringify(variation_attributes));
          //   var result2 = JSON.parse(JSON.stringify(v.attributes));

          //   //Find values that are in result1 but not in result2
          //   var uniqueResultOne = result1.filter(function (obj) {
          //     return !result2.some(function (obj2) {
          //       return obj.child_id == obj2.child_id;
          //     });
          //   });

          //   //Find values that are in result2 but not in result1
          //   var uniqueResultTwo = result2.filter(function (obj) {
          //     return !result1.some(function (obj2) {
          //       return obj.child_id == obj2.child_id;
          //     });
          //   });

          //   //Combine the two arrays of unique entries
          //   var result = uniqueResultOne.concat(uniqueResultTwo);
          //   if (!result.length) {
          //     isDuplicateVariation = true;
          //     return false;
          //   }
          // });

          // if (isDuplicateVariation) {
          //   toast("error", "This variation is already added.");
          //   return false;
          // }
          if (checkDuplicateAddVariation()) {
            toast("error", "This variation is already added.");
            return false;
          }

          //end check duplicate variations
          obj_data["attributes"] = JSON.parse(
            JSON.stringify(variation_attributes)
          );
          //Add images from dropzone
          obj_data["images"] = JSON.parse(JSON.stringify(variation_images));

          $("#modal_variation").modal("hide");
          toast("success", "Variation save.");

          if (selected_variation_key != null) {
            obj_data["default"] =
              variation_list[selected_variation_key]["default"];
            obj_data["id"] = variation_list[selected_variation_key].id;
            variation_list[selected_variation_key] = obj_data;
          } else {
            //Set default variation
            if (variation_list.length <= 0) {
              obj_data["default"] = 1;
            } else {
              obj_data["default"] = 0;
            }
            obj_data["id"] = "";
            variation_list.push(obj_data);
          }

          // refresh variation table
          variationList();
        });
      },
      error: function () {
        toast("error", "Error has occurred. Try again.");
        $("#btn_add_variation").prop("disabled", false);
      },
    });
  }

  function variationList() {
    console.log("List: ");
    console.log(variation_list);
    var variationTableId = "#tbl_variations";

    if ($.fn.DataTable.isDataTable(variationTableId)) {
      //  $(variationTableId).dataTable();
      myVariationList.clear();
      myVariationList.destroy();
    }

    $(variationTableId + " tbody").empty();
    $(variationTableId + " thead").empty();

    if (variation_list.length <= 0) {
      return false;
    }
    //Object to table logic & algorithm : Clrkz 04/19/22
    //fix cols
    var cols = [
      {
        title: "Image",
        data: "image",
        className: "align-middle p-1 dt-center",
        render: function (data, type, row, meta) {
          return (
            ` 
              <img src="` +
            row.image +
            `" alt="Image" width="50" height="50">
              `
          );
        },
        width: "5%",
      },
      {
        title: "Price",
        data: "price",
        className: "align-middle p-1 dt-center",
        ordering: true,
        width: "15%",
        render: function (data, type, row, meta) {
          var sale_price_end = moment(variation_list[row.key].sale_price_end);
          // console.log(sale_price_end);
          var date_now = moment();
          // console.log(sale_price_end);
          // console.log(date_now);
          // date is past
          var price =
            CURRENCY_SYMBOL +
            parseFloat(row.price).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            });

          var sale_price = variation_list[row.key].sale_price;

          var final_sale_price =
            CURRENCY_SYMBOL +
            parseFloat(sale_price).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }) +
            `<br><del class="text-danger">` +
            price +
            `</del>`;

          if (sale_price_end.isValid()) {
            if (sale_price_end > date_now) {
              // var sale_price = variation_list[row.key].sale_price;
              return final_sale_price;
            }
          } else {
            if (sale_price) {
              return final_sale_price;
            }
          }
          return price;
        },
      },
      {
        title: "Default",
        data: "default",
        render: function (data, type, row, meta) {
          return (
            `
              <div class="text-center">
              <input class="default" type="radio" name="touchbutton" data-key="` +
            row.key +
            `" value="" ` +
            (row.default ? "checked" : "") +
            ` >
              </div>
              `
          );
        },
        className: "align-middle p-1 dt-center",
        width: "5%",
      },
      {
        title: "Action",
        data: "key",
        render: function (data, type, row, meta) {
          return (
            `
             <div class="row justify-content-center">
                     <a data-update='` +
            row.key +
            `' style="cursor:pointer;" class="edit  m-1 btn btn-primary btn-icon btn-sm" title="Edit"><i class="fa fa-pen"></i></a> 
                     <a data-remove='` +
            row.key +
            `' style="cursor:pointer;" class="remove m-1 btn btn-sm btn-danger" title="Remove"><i class="fa fa-trash"></i></a>
             </div>
              `
          );
        },
        className: "align-middle p-1 dt-center",
        width: "10%",
      },
    ];

    //get the variation as table cols
    var col_attribute = [];
    $.each(variation_list[0].attributes, function (i, v) {
      if (!v) {
        return;
      }
      col_attribute.push({
        title: capitalizeFirstLetter(v.parent_name),
        data: v.parent_name.toLowerCase().trim(),
        className: "align-middle p-1",
      });
    });
    //apend variation to fix cols
    $.each(col_attribute.reverse(), function (i, v) {
      cols.splice(1, 0, col_attribute[i]);
    });

    //Table Data
    var data = [];
    $.each(variation_list, function (i, v) {
      var fix_data = {
        image:
          v.images.length <= 0
            ? APP_DISK + "products/default.png"
            : APP_DISK + v.images[0].path,
        price: v.price,
        default: v.default,
        key: i,
      };

      var data_attribute = [];
      $.each(v.attributes, function (j, k) {
        if (!k) {
          return;
        }
        data_attribute[k.parent_name.toLowerCase().trim()] = k.child_name;
      });

      var merge_data = {};
      Object.assign(merge_data, fix_data, data_attribute);

      //  console.log(merge_data)

      data.push(merge_data);
    });

    myVariationList = $(variationTableId).DataTable({
      retrieve: true,
      columns: cols,
      data: data,
      paging: true,
      lengthChange: false,
      searching: false,
      ordering: false,
      info: true,
      autoWidth: false,
      responsive: true,
    });
  }

  function formatCategory(category) {
    if (!category.id) {
      return category.text;
    }

    var baseUrl = "/assets/img/logo/AGC_TRANSPARENT.png";
    var $category = $('<span><img class="img-flag" /> <span></span></span>');

    // Use .text() instead of HTML string concatenation to avoid script injection issues
    $category.find("span").text(category.text.replaceAll("¦––", ""));
    //  $category.find("img").attr("src", baseUrl + "/" + category.element.value.toLowerCase() + ".png");

    return $category;
  }

  function filterArray(array) {
    return array.filter(function (el) {
      return el != null;
    });
  }

  function disableSelected() {
    $(".repeater")
      .find("select")
      .each(function () {
        var $current_el = $(this);
        $("option:disabled", this).removeAttr("disabled");
        //  $.each(selected_attributes, function(index, value) {
        var current_value = $(this).val();
        $("option", $current_el).each(function () {
          if (current_value != $(this).val()) {
            var $option_el = $(this);
            if (jQuery.inArray($option_el.val(), selected_attributes) !== -1) {
              $option_el.attr("disabled", "disabled");
            }
            //  $.each(selected_attributes, function(index, value) {
            //      if ($option_el.val() == value) {
            //          $option_el.attr("disabled", "disabled");
            //      }
            //  });
          }
        });
      });
  }

  function gotoTab(nav, pane) {
    $(".nav-1").removeClass("active");
    $(".pane-1").removeClass("active show");
    $(nav).addClass("active");
    $(pane).addClass("active show");
  }

  //Update Products
  function fetchProductInformation() {
    console.log("Product Information: ");
    console.log(product_information_json);
    if (!Object.keys(product_information_json).length) {
      return false;
    }

    $('input[name="catalog_name"]').val(product_information_json.title);
    $("#catalog_description").summernote(
      "code",
      product_information_json.content
    );
    //catehories
    $("select[name=catalog_brand]")
      .val(product_information_json.brandId)
      .trigger("change");
    $("select[name=catalog_tax]")
      .val(product_information_json.taxId)
      .trigger("change");
    if (product_information_json.available) {
      $("input[name=catalog_status]").prop("checked", true).trigger("change");
    }
    $.each(product_information_json.categories, function (i, v) {
      $("#catalog_category option[value='" + v + "']")
        .prop("selected", true)
        .trigger("change");
    });

    //Main images
    $.each(product_information_json.product_images, function (i, v) {
      product_images.push({
        id: v.id,
        path: v.path,
        size: v.size,
        name: v.name,
      });

      var mockFile = {
        id: v.id,
        name: v.name, //v.path,
        size: v.size, //'12345' //v.unreadable_size
      };

      myDzProductMainPhotos.emit("addedfile", mockFile);
      myDzProductMainPhotos.emit("complete", mockFile);
      myDzProductMainPhotos.emit(
        "thumbnail",
        mockFile,
        APP_DISK + "thumbnails/" + v.path
      );
      myDzProductMainPhotos.files.push(mockFile); // here you add them into the files array
    });

    //  variation_list = product_information_json.variations;

    if (product_information_json.attribute_sets.length) {
      $(".variations").show();
      $(".non-variations").hide();
    }

    //Variations and Attributes
    $.each(product_information_json.attribute_sets, function (i, v) {
      $("[data-repeater-create]").trigger("click");
      var $attr_el = $(
        'select[name="attribute_list[' + i + '][attribute_name]"]'
      );
      $attr_el.val(v.id);
    });

    setTimeout(function () {
      $.each(product_information_json.attribute_sets, function (i, v) {
        var $attr_el = $(
          'select[name="attribute_list[' + i + '][attribute_name]"]'
        );
        $attr_el.trigger("change");

        // var key = $attr_el.attr("data-select2-id");
        // selected_attributes[key] = $attr_el.val();
      });
      // disableSelected();
      //  console.log(selected_attributes)
      variation_list = product_information_json.variations;
      variationList();
      console.log(selected_attributes);
    }, 1000);

    // var key = $(this).find(".select2").attr("data-select2-id");
    // selected_attributes[key] = $(this).val();

    //Pricing
    $('input[name="catalog_price"]').val(product_information_json.price);
    $('input[name="catalog_sale_price"]').val(
      product_information_json.discount
    );
    // if (product_information_json.startsAt) {
    // $('input[name="catalog_sale_price_start"]').val(
    //   moment(product_information_json.startsAt).format("M/D/YYYY hh:mm A")
    // );
    $('input[name="catalog_sale_price_start"]').val(
      product_information_json.startsAt
    );
    // }
    // if (product_information_json.endsAt) {
    $('input[name="catalog_sale_price_end"]').val(
      // moment(product_information_json.endsAt).format("M/D/YYYY hh:mm A")
      product_information_json.endsAt
    );
    // }

    //  Inventory
    $('input[name="catalog_sku"]').val(product_information_json.sku);
    $('input[name="catalog_quantity"]').val(product_information_json.quantity);
    $('input[name="catalog_max_quantity"]').val(
      product_information_json.maxQty
    );
    $('input[name="catalog_order_quantity"]').val(
      product_information_json.reorderQty
    );
    $('input[name="catalog_min_order_qty"]').val(
      product_information_json.minOrderQty
    );
    $('input[name="catalog_max_order_qty"]').val(
      product_information_json.maxOrderQty
    );

    //Locations
    var prod_loc = product_information_json.locations;
    if (typeof prod_loc[0] != "undefined") {
      var whOption = new Option(prod_loc[0].title, prod_loc[0].id, true, true);
      $('select[name="catalog_warehouse"]').append(whOption).trigger("change");
    }
    if (typeof prod_loc[1] != "undefined") {
      var floorOption = new Option(
        prod_loc[1].title,
        prod_loc[1].id,
        true,
        true
      );
      $('select[name="catalog_floor"]').append(floorOption).trigger("change");
    }
    if (typeof prod_loc[2] != "undefined") {
      var rackOption = new Option(
        prod_loc[2].title,
        prod_loc[2].id,
        true,
        true
      );
      $('select[name="catalog_rack"]').append(rackOption).trigger("change");
    }
    if (typeof prod_loc[3] != "undefined") {
      var binOption = new Option(prod_loc[3].title, prod_loc[3].id, true, true);
      $('select[name="catalog_bin"]').append(binOption).trigger("change");
    }
  }
  $(function () {
    "use strict";

    $.fn.datetimepicker.Constructor.Default = $.extend(
      {},
      $.fn.datetimepicker.Constructor.Default,
      {
        icons: {
          time: "fa fa-clock",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down",
          previous: "fa fa-chevron-left",
          next: "fa fa-chevron-right",
          today: "fa fa-calendar-check-o",
          clear: "fa fa-trash",
          close: "fa fa-times",
        },
      }
    );

    $("[name='catalog_status']").change(function () {
      if ($(this).is(":checked")) {
        $(this).val("1");
      } else {
        $(this).val("0");
      }
    });

    $(".select2_category").select2({
      theme: "bootstrap4",
      templateSelection: formatCategory,
    });

    $("#catalog_description").summernote({
      tabsize: 2,
      height: 250,
    });

    $("#catalog_name").on("click", function () {
      if ($("#catalog_description").summernote("isEmpty")) {
        //  alert('editor content is empty');
      } else {
        //summernote codes
        var html = $("#catalog_description").summernote("code");
        //  alert(html);
      }
    });

    removeSubmitButtonOffsetOn([
      "#vert-tabs-attributes",
      "#vert-tabs-variations",
      "#vert-tabs-images",
    ]);

    // Catalog form
    $.validator.addMethod(
      "catalogDescription",
      function (value, element, param) {
        if ($("#catalog_description").summernote("isEmpty")) {
          gotoTab("#vert-tabs-general-tab", "#vert-tabs-general");
          return false;
        }
        return true;
      },
      "This field is required."
    );

    $.validator.addMethod(
      "catalogQuantity",
      function (value, element, param) {
        //if no attributes
        var filtered_selected_attributes = filterArray(selected_attributes);
        if (!filtered_selected_attributes.length) {
          // if (parseInt($('input[name="catalog_max_quantity"]').val()) > 0) {
          if ($('input[name="catalog_max_quantity"]').val() != "") {
            if (
              parseInt($('input[name="catalog_max_quantity"]').val()) <
              parseInt($('input[name="catalog_quantity"]').val())
            ) {
              gotoTab("#vert-tabs-inventory-tab", "#vert-tabs-inventory");
              // $('input[name="catalog_quantity"]').trigger("focus");
              return false;
            }
          }
        }
        return true;
      },
      "Quantity must not greater than max quantity."
    );

    $.validator.addMethod(
      "catalogMinQuantity",
      function (value, element, param) {
        //if no attributes
        var filtered_selected_attributes = filterArray(selected_attributes);
        if (!filtered_selected_attributes.length) {
          if ($('input[name="catalog_max_order_qty"]').val() != "") {
            if (
              parseInt($('input[name="catalog_max_order_qty"]').val()) <
              parseInt($('input[name="catalog_min_order_qty"]').val())
            ) {
              gotoTab("#vert-tabs-inventory-tab", "#vert-tabs-inventory");
              return false;
            }
          }
        }
        return true;
      },
      "Minimum order quantity must not greater than max order quantity."
    );
    $.validator.addMethod(
      "catalogOrderQuantity",
      function (value, element, param) {
        //if no attributes
        var filtered_selected_attributes = filterArray(selected_attributes);
        if (!filtered_selected_attributes.length) {
          if (
            parseInt($('input[name="catalog_max_quantity"]').val()) <
            parseInt($('input[name="catalog_order_quantity"]').val())
          ) {
            $.validator.messages.catalogOrderQuantity =
              "Order quantity must not greater than max quantity.";
            gotoTab("#vert-tabs-inventory-tab", "#vert-tabs-inventory");
            // $('input[name="catalog_order_quantity"]').trigger("focus");
            return false;
          }
        }
        return true;
      },
      $.validator.messages.catalogOrderQuantity
    );

    $.validator.addMethod(
      "catalogPrice",
      function (value, element, param) {
        //if no attributes
        var filtered_selected_attributes = filterArray(selected_attributes);
        if (!filtered_selected_attributes.length) {
          if ($('input[name="catalog_price"]').val() == "") {
            $.validator.messages.catalogPrice = "This field is required.";
            gotoTab("#vert-tabs-price-tab", "#vert-tabs-price");
            // $('input[name="catalog_price"]').trigger("focus");
            return false;
          }
        }
        return true;
      },
      $.validator.messages.catalogPrice
    );

    // if (
    //   ($("#sale_price_start").val() &&
    //     !$('input[name="sale_price"]').val()) ||
    //   ($("#sale_price_end").val() && !$('input[name="sale_price"]').val())
    // ) {
    //   toast("error", "Sale price cannot be empty.");
    //   $('input[name="sale_price"]').trigger("focus");
    //   return false;
    // }

    // if (
    //   parseInt($('input[name="price"]').val()) <=
    //   parseInt($('input[name="sale_price"]').val())
    // ) {
    //   toast("error", "Sale price must not greater or equal than price.");
    //   $('input[name="sale_price"]').trigger("focus");
    //   return false;
    // }

    $.validator.addMethod(
      "catalogSalePriceEnd",
      function (value, element, param) {
        //if no attributes
        var filtered_selected_attributes = filterArray(selected_attributes);
        if (!filtered_selected_attributes.length) {
          if (
            ($("#catalog_sale_price_start").val() &&
              !$("#catalog_sale_price_end").val()) ||
            (!$("#catalog_sale_price_start").val() &&
              $("#catalog_sale_price_end").val()) ||
            moment($("#catalog_sale_price_start").val()) >=
              moment($("#catalog_sale_price_end").val())
          ) {
            $.validator.messages.catalogSalePriceEnd =
              "Invalid sale date range.";
            gotoTab("#vert-tabs-price-tab", "#vert-tabs-price");
            // $('input[name="catalog_sale_price_start"]').trigger("focus");
            return false;
          }
        }
        return true;
      },
      $.validator.messages.catalogSalePriceEnd
    );

    $.validator.addMethod(
      "catalogSalePrice",
      function (value, element, param) {
        //if no attributes
        var filtered_selected_attributes = filterArray(selected_attributes);
        if (!filtered_selected_attributes.length) {
          if (
            ($("#catalog_sale_price").val() &&
              !$('input[name="catalog_sale_price"]').val()) ||
            ($("#catalog_sale_price_end").val() &&
              !$('input[name="catalog_sale_price"]').val())
          ) {
            $.validator.messages.catalogSalePrice =
              "Sale price cannot be empty.";
            gotoTab("#vert-tabs-price-tab", "#vert-tabs-price");
            // $('input[name="catalog_sale_price_start"]').trigger("focus");
            return false;
          }

          if (
            parseInt($('input[name="catalog_price"]').val()) <=
            parseInt($('input[name="catalog_sale_price"]').val())
          ) {
            $.validator.messages.catalogSalePrice =
              "Sale price must not greater or equal than price.";
            gotoTab("#vert-tabs-price-tab", "#vert-tabs-price");
            // $('input[name="catalog_sale_price"]').trigger("focus");
            return false;
          }
        }
        return true;
      },
      $.validator.messages.catalogSalePrice
    );

    $.validator.setDefaults({
      submitHandler: function (form) {
        // console.log(variation_list);
        // return false;

        window.onbeforeunload = false;
        var formData = new FormData(form);

        formData.append(
          "id",
          Object.keys(product_information_json).length
            ? product_information_json.id
            : ""
        );

        var filtered_selected_attributes = filterArray(selected_attributes);
        if (filtered_selected_attributes.length) {
          if (variation_list.length) {
            //chyeck if all variations attribute has filled
            var isVariationAttributeNotEmpty = true;
            // check if all variations has assigned attribute
            $.each(variation_list, function (i, v) {
              $.each(v.attributes, function (k, j) {
                if (!j.child_id) {
                  isVariationAttributeNotEmpty = false;
                  return false;
                }
              });
            });

            if (isVariationAttributeNotEmpty) {
              // $('input[name="variations"]').val(JSON.stringify(variation_list));
              formData.append("variations", JSON.stringify(variation_list));
            } else {
              gotoTab("#vert-tabs-variations-tab", "#vert-tabs-variations");
              toast(
                "error",
                "There's an incomplete variation, check attribute values."
              );
              return false;
            }

            //check if no duplicate variaions attributes
            if (checkDuplicateVariation()) {
              gotoTab("#vert-tabs-variations-tab", "#vert-tabs-variations");
              toast("error", "There are duplicate variations");
              return false;
            }
          } else {
            gotoTab("#vert-tabs-variations-tab", "#vert-tabs-variations");
            toast("error", "Add at least 1 product variation.");
            return false;
          }
        }
        //else {
        // $('input[name="product_images"]').val(JSON.stringify(product_images));
        formData.append("product_images", JSON.stringify(product_images));
        // }

        // var $form = $("#catalogForm");
        // $form.append("test", "nice");

        $.ajax({
          url: "/admin/products",
          type: "POST",
          data: formData,
          // timeout: 9000,
          processData: false,
          contentType: false,
          beforeSend: function () {
            $("#btn_save_product").prop("disabled", true);
          },
          success: function (result) {
            // console.log(result);
            // $("#btn_save_product").prop("disabled", false);
            window.location.replace("/admin/products");
            // $("#btn_save_product").prop("disabled", false);
            return false;
          },
          error: function () {
            toast("error", "Error has occurred. Try again.");
            $("#btn_save_product").prop("disabled", false);
          },
        });

        return false;
      },
      ignore: [],
    });

    $("#catalogForm").validate({
      rules: {
        catalog_name: {
          required: true,
        },
        catalog_description: {
          catalogDescription: true,
        },
        catalog_price: {
          catalogPrice: true,
          min: 0,
        },
        catalog_sale_price_end: {
          catalogSalePriceEnd: true,
        },
        catalog_sale_price: {
          catalogSalePrice: true,
          min: 0,
        },
        catalog_quantity: {
          catalogQuantity: true,
          min: 0,
        },
        catalog_max_quantity: {
          min: 0,
        },
        catalog_order_quantity: {
          catalogOrderQuantity: true,
          min: 0,
        },
        catalog_min_order_qty: {
          catalogMinQuantity: true,
          min: 0,
        },
        catalog_max_order_qty: {
          min: 0,
        },
      },
      messages: {
        // catalog_name: "Meow",
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

    //fux summernote error on validator
    $("#catalogForm").each(function () {
      if ($(this).data("validator"))
        $(this).data("validator").settings.ignore = ".note-editor *";
    });

    $(".repeater").repeater({
      repeaters: [
        {
          // (Required)
          // Specify the jQuery selector for this nested repeater
          selector: ".inner-repeater",
        },
      ],
      hide: function (deleteElement) {
        var option_key = $(this).find("select").val();

        if (option_key) {
          Swal.fire({
            title: "Are you sure?",
            text: "This attribute will be remove to all variants of this product.",
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
              // remove this attribute to every variation
              $.each(variation_list, function (i, v) {
                $.each(v.attributes, function (k, j) {
                  if (j.parent_id == option_key) {
                    delete variation_list[i].attributes[k];
                    // clean and refresh variations attributes
                    variation_list[i].attributes = variation_list[
                      i
                    ].attributes.filter(function (el) {
                      return el != null;
                    });
                  }
                });
              });

              //check if theres more attribute to variation then if none remove all variation
              var variation_counter = 0;
              // $.each(variation_list, function (i, v) {
              //   $.each(v.attributes, function (k, j) {
              //     variation_counter++;
              //   });
              //   return false;
              // });

              if (variation_list.length) {
                variation_counter = variation_list[0].attributes.length;
                // $.each(variation_list[0].attributes, function (k, j) {
                //   if (parent_id == j.parent_id) {
                //     hasAttribute = true;
                //     return false;
                //   }
                // });
              }

              // console.log(variation_counter);

              if (!variation_counter) {
                variation_list = [];

                var variationTableId = "#tbl_variations";

                if ($.fn.DataTable.isDataTable(variationTableId)) {
                  //  $(variationTableId).dataTable();
                  myVariationList.clear();
                  myVariationList.destroy();
                }

                // if (myVariationList != null) {
                //   myVariationList.clear();
                //   // myVariationList.destroy(false);
                // }

                $(variationTableId + " tbody").empty();
                $(variationTableId + " thead").empty();
              } else {
                variationList();
              }

              $(this).slideUp(function () {
                //remove key in array
                // var key = $(this).find(".select2").attr("data-select2-id");
                var key = $(this).find("select").attr("data-select2-id");
                // alert(key);
                delete selected_attributes[key];

                disableSelected();

                deleteElement();
                //  itemRemove(); //another function if necessary

                var repeatCount = $(".repeater").find("select").length;
                var optionCount = $(this)
                  .find("select")
                  .children("option").length;
                if (repeatCount != optionCount) {
                  $("[data-repeater-create]").show();
                }

                var filtered_selected_attributes =
                  filterArray(selected_attributes);
                if (!filtered_selected_attributes.length) {
                  $(".variations").hide();
                  $(".non-variations").show();
                }
              });
            }
          });
        } else {
          //remove if no option selected
          $(this).slideUp(function () {
            //remove key in array
            // var key = $(this).find(".select2").attr("data-select2-id");
            var key = $(this).find("select").attr("data-select2-id");
            delete selected_attributes[key];

            disableSelected();

            deleteElement();
            //  itemRemove(); //another function if necessary

            var repeatCount = $(".repeater").find("select").length;
            var optionCount = $(this).find("select").children("option").length;
            if (repeatCount != optionCount) {
              $("[data-repeater-create]").show();
            }

            var filtered_selected_attributes = filterArray(selected_attributes);
            if (!filtered_selected_attributes.length) {
              $(".variations").hide();
              $(".non-variations").show();
            }
          });
        }
      },
      show: function () {
        //  $(this).slideDown();
        $(this).slideDown(function () {
          //init select2 after adding repeater
          $(this).find(".select2repeater").select2({
            placeholder: "Select an option",
            minimumResultsForSearch: -1,
          });

          //fix select2 arrow ui
          $(this).find(".select2-selection__arrow").addClass("mt-1");

          $(this)
            .find("select")
            .on("change", function () {
              //add select2 id and selected value to array
              var key = $(this).attr("data-select2-id");
              console.log(key);

              var parent_id = $(this).val();

              // check if this attr is exist to variation attribute
              // if not exist add if exist ignore

              var hasAttribute = false;
              if (variation_list.length) {
                $.each(variation_list[0].attributes, function (k, j) {
                  if (parent_id == j.parent_id) {
                    hasAttribute = true;
                    return false;
                  }
                });
              }

              // check if attribte exist if not push to selected attributes obj
              if (!hasAttribute) {
                var attr_obj = {
                  parent_id: parseInt(parent_id),
                  parent_name: $("option:selected", this).text(),
                  child_id: "",
                  child_name: "",
                };

                $.each(variation_list, function (i, v) {
                  variation_list[i].attributes.push(attr_obj);
                });

                selected_attributes[key] = $(this).val();
              }

              //remove list
              // 1. get variation attributes
              // 2. compare 2 selected attributes
              // 3. remnove variation attribute if not exist in selected variations

              var filtered_selected_attributes =
                filterArray(selected_attributes);

              $.each(variation_list, function (i, v) {
                $.each(v.attributes, function (k, j) {
                  if (
                    !filtered_selected_attributes.includes(
                      parseInt(j.parent_id)
                    )
                  ) {
                    // delete variation_list[i].attributes[k];

                    variation_list[i].attributes = filterArray(
                      variation_list[i].attributes
                    );
                  }
                });
              });

              //hide non varaitons elements
              if (filtered_selected_attributes.length) {
                $(".variations").show();
                $(".non-variations").hide();
              }

              variationList();
              // }
              disableSelected();
            });

          //enable all option in repeater select2

          //disable array option in repeater
          disableSelected();

          var repeatCount = $(".repeater").find("select").length;
          var optionCount = $(this).find("select").children("option").length;
          if (repeatCount == optionCount) {
            $("[data-repeater-create]").hide();
          }
        });
      },
      // defaultValues: {
      //'text-input': 'foo'
      //},
      ready: function (setIndexes) {
        //  console.log('repeater ready');
      },
      initEmpty: true,
      //  isFirstItemUndeletable: true,
    });

    responsiveDatatablesTab();

    $("#btn_add_variation").on("click", function (e) {
      selected_variation_key = null;
      variationForm();
    });

    $("#tbl_variations").on("click", "td .edit", function () {
      var $el = $(this).parents("td").last();
      var row = myVariationList.row($el).data();
      //  console.log(row);
      selected_variation_key = row.key;
      variationForm();
    });

    $("#tbl_variations").on("click", "td .remove", function () {
      //  var table = $('#tbl_variations').DataTable();
      //  var cell = myVariationList.cell($el).data(); // returns correct cell data
      //  console.log(cell);
      var $el = $(this).parents("td").last();
      var row = myVariationList.row($el).data();
      //  console.log(row);
      Swal.fire({
        title: "Are you sure, you want to remove this variation?",
        text: "This action cannot be undone.",
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
          if (row.default) {
            //transfer default
            //  variation_list[row.key + 1] = 1;
            //  console.log(variation_list[row.key + 1]);
            if (typeof variation_list[row.key + 1] != "undefined") {
              variation_list[row.key + 1].default = 1;
            }
          }
          delete variation_list[row.key];
          // clean and refresh variations attributes
          variation_list = variation_list.filter(function (el) {
            return el != null;
          });

          variationList();
        }
      });
    });

    $("#tbl_variations").on("click", "td .default", function () {
      var $el = $(this).parents("td").last();
      var row = myVariationList.row($el).data();
      $.each(variation_list, function (i, v) {
        variation_list[i].default = 0;
      });
      variation_list[row.key].default = 1;
      //  console.log(variation_list)
    });

    // dzProductPhotos("#catalog_dz_product_photo");
    dzProductPhotosMain();

    //initialize datepicker
    $(".datetimepicker").datetimepicker({
      format: "MM/DD/YYYY hh:mm A",
      // minDate: moment().subtract(1, "day"),
    });

    $('select[name="catalog_store"]').select2({
      theme: "bootstrap4",
      language: {
        noResults: function () {
          return "Enter store name.";
        },
      },
      escapeMarkup: function (markup) {
        return markup;
      },
      //  placeholder: 'Please Select',
      ajax: {
        url: "/admin/stores/options",
        dataType: "json",
        delay: 250,
        data: function (data) {
          return {
            search: data.term,
            limit: 15,
          };
        },
        processResults: function (response) {
          return {
            results: response,
          };
        },
        cache: true,
      },
    });

    var default_store = {
      id: 1,
      text: "Default",
    };

    var newOption = new Option(
      default_store.text,
      default_store.id,
      false,
      false
    );
    $('select[name="catalog_store"]').append(newOption).trigger("change");

    //init product location warehouse,floor,rack,bin
    $('select[name="catalog_warehouse"]').select2({
      theme: "bootstrap4",
      language: {
        noResults: function () {
          return "Select store and enter warehouse name.";
        },
      },
      escapeMarkup: function (markup) {
        return markup;
      },
      placeholder: "Please Select",
      ajax: {
        url: "/admin/inventory/locations",
        dataType: "json",
        delay: 250,
        data: function (data) {
          return {
            search: data.term,
            limit: 15,
            store_id: $('select[name="catalog_store"]').val(),
          };
        },
        processResults: function (response) {
          return {
            results: response,
          };
        },
        cache: true,
      },
    });

    $('select[name="catalog_floor"]').select2({
      theme: "bootstrap4",
      language: {
        noResults: function () {
          return "Select warehouse and enter floor name.";
        },
      },
      escapeMarkup: function (markup) {
        return markup;
      },
      placeholder: "Please Select",
      ajax: {
        url: "/admin/inventory/locations",
        dataType: "json",
        delay: 250,
        data: function (data) {
          return {
            search: data.term,
            limit: 15,
            parent_id: $('select[name="catalog_warehouse"]').val(),
            type: "floor",
          };
        },
        processResults: function (response) {
          return {
            results: response,
          };
        },
        cache: true,
      },
    });

    $('select[name="catalog_rack"]').select2({
      theme: "bootstrap4",
      language: {
        noResults: function () {
          return "Select floor and enter rack name.";
        },
      },
      escapeMarkup: function (markup) {
        return markup;
      },
      placeholder: "Please Select",
      ajax: {
        url: "/admin/inventory/locations",
        dataType: "json",
        delay: 250,
        data: function (data) {
          return {
            search: data.term,
            limit: 15,
            parent_id: $('select[name="catalog_floor"]').val(),
            type: "rack",
          };
        },
        processResults: function (response) {
          return {
            results: response,
          };
        },
        cache: true,
      },
    });

    $('select[name="catalog_bin"]').select2({
      theme: "bootstrap4",
      language: {
        noResults: function () {
          return "Select floor and enter bin name.";
        },
      },
      escapeMarkup: function (markup) {
        return markup;
      },
      placeholder: "Please Select",
      ajax: {
        url: "/admin/inventory/locations",
        dataType: "json",
        delay: 250,
        data: function (data) {
          return {
            search: data.term,
            limit: 15,
            parent_id: $('select[name="catalog_rack"]').val(),
            type: "bin",
          };
        },
        processResults: function (response) {
          return {
            results: response,
          };
        },
        cache: true,
      },
    });

    $('select[name="catalog_warehouse"]').on("change", function () {
      $('select[name="catalog_floor"]').val(null).trigger("change");
    });

    $('select[name="catalog_floor"]').on("change", function () {
      $('select[name="catalog_rack"]').val(null).trigger("change");
    });

    $('select[name="catalog_rack"]').on("change", function () {
      $('select[name="catalog_bin"]').val(null).trigger("change");
    });

    closeAlert("catalogForm");

    //Updating of product
    fetchProductInformation();
  });
})();
