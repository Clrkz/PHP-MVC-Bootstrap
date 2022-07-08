/*
 * Author: Clarence A Andaya
 * Date: 24 Mar 2022
 */

(function () {
  "use strict";

  const search_product = {
    offset: 0,
    limit: 10,
    count: 0,
    list: [],
  };

  const search_buyer = {
    offset: 0,
    limit: 15,
    // count: 0,
    list: [],
  };

  const $total_amount = $(".total_amount");
  const $btn_paid = $("#btn_paid");
  const $btn_pay_later = $("#btn_pay_later");
  const $modal_container = $(".modal_container");

  var $remove_buyer = null;

  var selected_products = [];
  var selected_buyer = null;
  var selected_payment = null;

  var ajax_search_product = null;
  var ajax_search_buyer = null;

  var open_order_modal = false;

  //Logic,Variables, Functions Here
  function currencyNumberFormat(num) {
    return (
      CURRENCY_SYMBOL +
      parseFloat(num).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })
    );
  }

  function filterArray(array) {
    return array.filter(function (el) {
      return el != null;
    });
  }

  function orderTotal(selected_products_index) {
    //  get order total
    var order_total = 0;
    $.each(
      selected_products[selected_products_index].products,
      function (sp_i, sp_v) {
        order_total +=
          (sp_v.price + sp_v.price * (sp_v.tax_percentage / 100)) *
          sp_v.order_quantity;
      }
    );

    return selected_products[selected_products_index].shipping
      ? parseInt(order_total) +
          parseInt(selected_products[selected_products_index].shipping.price)
      : order_total;
  }

  function totalAmount() {
    //  get order total
    var total_amount = 0;
    $.each(selected_products, function (i, v) {
      var order_total = 0;
      $.each(v.products, function (sp_i, sp_v) {
        order_total +=
          (sp_v.price + sp_v.price * (sp_v.tax_percentage / 100)) *
          sp_v.order_quantity;
      });

      total_amount += v.shipping
        ? parseInt(order_total) + parseInt(v.shipping.price)
        : order_total;
    });

    return total_amount;
  }

  function orderButton() {
    if (selected_products.length && selected_buyer) {
      if (!open_order_modal) {
        open_order_modal = true;
        $btn_paid.removeAttr("disabled");
        $btn_pay_later.removeAttr("disabled");

        $btn_paid.on("click", function () {
          createOrder("completed");
        });
        $btn_pay_later.on("click", function () {
          createOrder("pending");
        });
      }
    } else {
      open_order_modal = false;
      $btn_paid.prop("disabled", true);
      $btn_pay_later.prop("disabled", true);
      $btn_paid.off("click");
      $btn_pay_later.off("click");
    }
  }

  function changeOrderQuantityEvent() {
    $(".table-normal").each(function (i, v) {
      const $tbody_tr = $(this).find("tbody > tr");
      const $tfoot_tr = $(this).find("tfoot > tr");

      const $order_total = $tfoot_tr.find(".order_total");
      const $txtarea_auto_h = $tfoot_tr.find(".textarea-auto-height");

      $txtarea_auto_h.textareaAutoSize();

      $txtarea_auto_h.on("change", function () {
        if (isEmpty($txtarea_auto_h.val())) {
          selected_products[i].notes = null;
        } else {
          selected_products[i].notes = $txtarea_auto_h.val();
        }
      });

      $tbody_tr.each(function (j, k) {
        const $price_x_order_qty = $(this).find(".price_x_order_qty");
        const $order_qty = $(this).find("input");
        const $remove_selected = $(this).find(".remove_selected");

        $order_qty.on("change", function () {
          const product = selected_products[i].products[j];

          //validate if order qty empty or zero
          if (isEmpty($(this).val()) || parseInt($(this).val()) <= 0) {
            $(this).val(product.order_quantity).trigger("change");
            return false;
          }

          const order_quantity = parseInt($(this).val());

          //validate if order qty is less than min order qty
          if (
            order_quantity < product.min_order_quantity &&
            product.min_order_quantity
          ) {
            $(this).val(product.min_order_quantity).trigger("change");
            return false;
          }

          // validate if order qty is less than or equal to max order qty
          if (
            order_quantity > product.max_order_quantity &&
            product.max_order_quantity
          ) {
            $(this).val(product.max_order_quantity).trigger("change");
            return false;
          }

          // validate if order qty is less than or equal to max order qty
          if (order_quantity > product.quantity && product.quantity) {
            $(this).val(product.quantity).trigger("change");
            return false;
          }

          // validate if order qty is less than or equal to max order qty
          if (
            order_quantity > product.max_order_quantity &&
            product.max_order_quantity
          ) {
            $(this).val(product.max_order_quantity).trigger("change");
            return false;
          }

          product.order_quantity = order_quantity;
          $price_x_order_qty.text(
            currencyNumberFormat(
              (product.price + product.price * (product.tax_percentage / 100)) *
                product.order_quantity
            )
          );

          $order_total.text(currencyNumberFormat(orderTotal(i)));
          $total_amount.text(currencyNumberFormat(totalAmount()));
        });

        // $remove_selected.on("click", function (e) {
        $remove_selected.on("click", function (e) {
          //  Logger.d(j);
          //  selected_products[i].products
          delete selected_products[i].products[j];
          selected_products[i].products = filterArray(
            selected_products[i].products
          );
          if (!selected_products[i].products.length) {
            delete selected_products[i];
            selected_products = filterArray(selected_products);
          }
          displaySelectedProduct();
        });
      });

      $tfoot_tr.each(function (j, k) {
        const $order_shipping = $(this).find(".order_shipping");
        const $shipping_price = $(this).find(".shipping_price");

        $order_shipping.on("click", function () {
          $.ajax({
            url: "/admin/orders/shipping",
            data: {
              csrf_token: $("#csrf_token").val(),
            },
            type: "POST",
            dataType: "json",
            beforeSend: function () {
              $modal_container.empty();
            },
            success: function (result) {
              $modal_container.html(result.data);

              $("#modal_shipping").modal("show");

              //set selected shipping to Shipping UI
              if (selected_products[i].shipping) {
                $("#txt_shipping_custom").prop("checked", true);
                $("#shipping_price").val(selected_products[i].shipping.id);
              } else {
                $("#txt_shipping_free").prop("checked", true);
              }

              $("#modal_shipping").on("hidden.bs.modal", function () {
                $(this).remove();
              });

              var shipping = default_shipping;
              $("#txt_shipping_free").on("change", function () {
                shipping = null;
              });

              $("#txt_shipping_custom,#shipping_price").on(
                "change",
                function () {
                  var shipping_row = result.shipping
                    .map(function (e) {
                      return e.id;
                    })
                    .indexOf($("#shipping_price").val());
                  shipping = result.shipping[shipping_row];
                  $("#txt_shipping_custom").prop("checked", true);
                  //for bypassing html
                  if (!shipping) {
                    shipping = null;
                    $("#txt_shipping_free").prop("checked", true);
                  }
                }
              );

              $("#btn_save_shipping").on("click", function () {
                selected_products[i].shipping = shipping;
                //  Logger.d(selected_products[i].shipping)
                if (shipping) {
                  $shipping_price.text(currencyNumberFormat(shipping.price));
                } else {
                  $shipping_price.text(currencyNumberFormat(0));
                }

                $order_total.text(currencyNumberFormat(orderTotal(i)));
                $total_amount.text(currencyNumberFormat(totalAmount()));

                $("#modal_shipping").modal("hide");
              });
            },
            error: function () {
              toast("error", "Error has occurred. Try again.");
            },
          });
        });
      });
    });
  }

  function displaySelectedProduct() {
    $(".table-wrapper").empty();
    //  Logger.d(JSON.stringify(selected_products));

    $.each(selected_products, function (i, v) {
      var html_products = ``;
      $.each(v.products, function (j, k) {
        //  Logger.d(k)
        html_products +=
          `<tr>
                                        <td class="width-60-px min-width-60-px">
                                            <div class="wrap-img vertical-align-m-i"><img src="` +
          APP_DISK +
          k.thumbnail +
          `" alt="` +
          k.name +
          `" class="thumb-image"></div>
                                        </td>
                                        <td class="pl5 p-r5 min-width-200-px">
                                        <a href="/admin/products/edit/` +
          k.parent_id +
          `" target="_blank" class="hover-underline pre-line">` +
          k.name +
          `</a>
                                            ` +
          (k.variation
            ? `<p class="type-subdued"><span>
                                                 ` +
              k.variation +
              `
                                                </span></p>`
            : ``) +
          `
                                        </td>
                                        <td class="pl5 p-r5 width-100-px min-width-100-px text-center">
                                            <div class="dropup dropdown-priceOrderNew">
                                                <div class="inline_block dropdown"><a class="wordwrap hide-print">` +
          // $percentage = 50;
          // $totalWidth = 350;
          // $new_width = ($percentage / 100) * $totalWidth;

          currencyNumberFormat(k.price + k.price * (k.tax_percentage / 100)) +
          `</a></div>
                                            </div>
                                        </td>
                                        <td class="pl5 p-r5 width-20-px min-width-20-px text-center"> x</td>
                                        <td class="pl5 p-r5 width-20-px min-width-100-px">
                                        <input type="number" class="next-input p-none-r" value="` +
          k.order_quantity +
          `"></td>
                                        <td class="pl5 p-r5 width-100-px min-width-100-px text-center price_x_order_qty">` +
          currencyNumberFormat(
            (k.price + k.price * (k.tax_percentage / 100)) * k.order_quantity
          ) +
          `</td>
                                        <td class="pl5 p-r5 text-end width-20-px min-width-20-px remove_selected">
                                            <i class="fa fa-times text-danger text-md cursor-pointer" aria-hidden="true"></i>
                                        </td>
                                    </tr>`;
      });

      const shipping_total = orderTotal(i);
      $(".table-wrapper").append(
        `
                           <table class="table-normal">
                                <thead>
                                    <tr class="bg-info">
                                        <td class="py-2 px-2" colspan="7">
                                            <span class="font-weight-bold">` +
          v.store_name +
          `</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>` +
          html_products +
          `</tbody>
                                <tfoot>
                                    <tr class="bg-light mb-2">
                                        <td colspan="5">
                                            <a   id="" href="#" class="order_shipping" role="button"><span>Shipping</span>
                                            </a>
                                        </td>
                                        <td class="text-center shipping_price" colspan="2">
                                           ` +
          currencyNumberFormat(
            selected_products[i].shipping
              ? selected_products[i].shipping.price
              : 0
          ) +
          `
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="7">
                                            <div class="form-group row mb-0 ">
                                                <div class="col-sm-12 ">
                                                    <!-- <label class="py-1 font-weight-normal m-0">Note -->
                                                    <!-- <span class="text-danger text-md">*</span> -->
                                                    <!-- </label> -->
                                                    <div class="form-group mb-1">
                                                        <!-- <textarea id="catalog_description" name="catalog_description"></textarea> -->
                                                        <textarea id="" rows="2" placeholder="Note for order..." class="ui-text-area textarea-auto-height">` +
          (selected_products[i].notes ? selected_products[i].notes : "") +
          `</textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="bg-secondary">
                                        <td class="py-2 px-2" colspan="5">
                                            <span class="font-weight-bold"> Order Total</span>
                                        </td>
                                        <td class="text-center py-2 px-2" colspan="3">
                                            <span class="font-weight-bold order_total">` +
          currencyNumberFormat(shipping_total) +
          `</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table> 
                            <hr>`
      );
    });

    $total_amount.text(currencyNumberFormat(totalAmount()));
    //  const total_amount = totalAmount();

    changeOrderQuantityEvent();
    orderButton();
  }

  function getStoreRow(i) {
    var store_id = search_product.list[i].store_id;
    var store_name = search_product.list[i].store;

    if (!selected_products.filter((p) => p.store_id == store_id).length) {
      selected_products.push({
        store_id: store_id,
        store_name: store_name,
        notes: null,
        shipping: default_shipping,
        products: [],
      });
    }

    var store_row = selected_products
      .map(function (e) {
        return e.store_id;
      })
      .indexOf(store_id);

    return store_row;
  }

  function productSelectionEvent() {
    $(".product-row").each(function (i, v) {
      if ($(this).find(".product-variant").length) {
        $(this)
          .find(".product-variant")
          .each(function (j, k) {
            $(this).on("click", function () {
              //  alert(j)
              var store_row = getStoreRow(i);
              const product = search_product.list[i].variations[j];
              if (
                !selected_products[store_row].products.filter(
                  (p) => p.id == product.id
                ).length
              ) {
                var order_quantity = 1;
                if (product.quantity && product.min_order_quantity) {
                  order_quantity = product.min_order_quantity;
                } else if (!product.quantity && product.min_order_quantity) {
                  order_quantity = product.min_order_quantity;
                }

                selected_products[store_row].products.push({
                  parent_id: search_product.list[i].id,
                  id: product.id,
                  thumbnail: search_product.list[i].thumbnail,
                  name: search_product.list[i].name,
                  sku: product.sku,
                  price: product.price,
                  tax_id: search_product.list[i].tax_id,
                  tax_percentage: search_product.list[i].tax_percentage,
                  variation: search_product.list[i].attributes_word,
                  quantity: product.quantity,
                  min_order_quantity: product.min_order_quantity,
                  max_order_quantity: product.max_order_quantity,
                  order_quantity: order_quantity,
                });
                displaySelectedProduct();
              }

              $(".product_result").removeClass("active").addClass("hidden");
            });
          });
      } else {
        $(this).on("click", function () {
          var store_row = getStoreRow(i);
          const product = search_product.list[i];
          if (
            !selected_products[store_row].products.filter(
              (p) => p.id == product.id
            ).length
          ) {
            var order_quantity = 1;
            if (product.quantity && product.min_order_quantity) {
              order_quantity = product.min_order_quantity;
            } else if (!product.quantity && product.min_order_quantity) {
              order_quantity = product.min_order_quantity;
            }
            selected_products[store_row].products.push({
              parent_id: product.id,
              id: product.id,
              thumbnail: product.thumbnail,
              name: product.name,
              sku: product.sku,
              price: product.price,
              variation: null,
              tax_id: product.tax_id,
              tax_percentage: product.tax_percentage,
              variation: product.attributes_word,
              quantity: product.quantity,
              min_order_quantity: product.min_order_quantity,
              max_order_quantity: product.max_order_quantity,
              order_quantity: order_quantity,
            });
            displaySelectedProduct();
          }

          $(".product_result").removeClass("active").addClass("hidden");
        });
      }
    });
  }

  function searchProducts() {
    if (ajax_search_product !== null) {
      ajax_search_product.abort();
    }

    var resetEl = function () {
      if (search_product.offset <= 0) {
        $("#btn_product_prev").prop("disabled", true);
      } else {
        $("#btn_product_prev").prop("disabled", false);
      }
      if (search_product.count <= 0) {
        $("#btn_product_next").prop("disabled", true);
      } else {
        $("#btn_product_next").prop("disabled", false);
      }

      $(".product_result").find(".has-loading").hide();
    };

    ajax_search_product = $.ajax({
      url: "/admin/orders/products",
      data: {
        csrf_token: $("#csrf_token").val(),
        search: $("#txt_product").val(),
        offset: search_product.offset,
        limit: search_product.limit,
      },
      type: "POST",
      dataType: "json",
      beforeSend: function () {
        $("#product_results_list").empty();
        $(".product_result").find(".has-loading").show();
        $("#btn_product_prev", "#btn_product_next").prop("disabled", true);
        //  $(".product_result").find("#product_results_list").show();
        search_product.list = [];
      },
      success: function (result) {
        search_product.count = result.length;
        search_product.list = result;

        $.each(result, function (i, v) {
          // Logger.d(result);
          var html_product = ``;
          if (v.variations.length) {
            var html_product_variations = ``;
            $.each(v.variations, function (j, k) {
              html_product_variations +=
                `<li class=" clearfix product-variant">
                                                           <a class=" float-left"><span>` +
                k.attributes_word +
                `</span>
                                                           </a>
                                                           <span><small>&nbsp;` +
                (k.quantity == null
                  ? ""
                  : "(" + k.quantity + " product(s) available)") +
                `</small></span>
                                                       </li>`;
            });

            html_product =
              `<li class="product-row item-not-selectable">
                                                <div class="wrap-img inline_block vertical-align-t float-left">
                                                <img src="` +
              APP_DISK +
              v.thumbnail +
              `" title="` +
              v.name +
              `" alt="` +
              v.name +
              `" class="thumb-image"></div> <label class="inline_block ml-2  ws-nm" style="width: calc(100% - 50px);">` +
              v.name_w_store +
              `
                                                </label>
                                                <div>
                                                    <div class="clear"></div>
                                                    <ul>` +
              html_product_variations +
              `</ul>
                                                </div>
                                            </li>`;
          } else {
            html_product =
              `<li class="product-row item-selectable" >
                                           <div class="wrap-img inline_block vertical-align-t float-left">
                                           <img src="` +
              APP_DISK +
              v.thumbnail +
              `" title="` +
              v.name +
              `" alt="` +
              v.name +
              `" class="thumb-image">
                                           </div>
                                            <label class="inline_block ml-2 mt-2 ws-nm" style="width: calc(100% - 50px);">` +
              v.name_w_store +
              ` 
                                           <span><small>&nbsp;` +
              (v.quantity == null
                ? ""
                : "(" + v.quantity + " product(s) available)") +
              `</small></span>
                                           </label> </li>`;
          }

          $("#product_results_list").append(html_product);
        });

        if (!result.length) {
          if (search_product.offset) {
            $("#product_results_list").append(
              `<li class="item-not-selectable">No more results...</li>`
            );
          } else {
            $("#product_results_list").append(
              `<li class="item-not-selectable">No results...</li>`
            );
          }
        } else {
          productSelectionEvent();
        }

        resetEl();
      },
      error: function () {
        resetEl();
        toast("error", "Error has occurred. Try again.");
      },
    });
  }

  function initProductSearchElements() {
    $("#txt_product").on("focusin", function () {
      $(".product_result").addClass("active").removeClass("hidden");
      if (!search_product.offset && !search_product.count) {
        searchProducts();
      } else {
        $(".product_result").find(".has-loading").hide();
        //  Logger.d(search_product.list)
      }
    });

    $("#txt_product").on(
      "keyup",
      delay(function (e) {
        search_product.offset = 0;
        search_product.count = 0;
        searchProducts();
      }, 1000)
    );

    $("#btn_product_next").on("click", function () {
      search_product.offset = search_product.offset + search_product.limit;
      searchProducts();
    });

    $("#btn_product_prev").on("click", function () {
      search_product.offset = search_product.offset - search_product.limit;
      searchProducts();
    });

    $(document).mouseup(function (e) {
      var product_box = $(".product_box");
      // if the target of the click isn't the container nor a descendant of the container
      if (!product_box.is(e.target) && product_box.has(e.target).length === 0) {
        $(".product_result").removeClass("active").addClass("hidden");
      }
    });
  }
  //////////////////////////////////////////////////// BUYER SECTION

  function buyerSelectionEvent() {
    $(".buyer-row").each(function (i, v) {
      const $findcustomer = $(".findcustomer");
      const $selected_customer = $(".selected_customer");
      const $selected_customer_image = $(".selected_customer_image");
      const $selected_customer_name = $(".selected_customer_name");
      const $selected_customer_email_href = $(".selected_customer_email_href");
      const $selected_customer_email = $(".selected_customer_email");

      const $selected_customer_addresses = $(".selected_customer_addresses");
      const $address_info = $(".address_info");
      $remove_buyer = $(".remove_buyer");

      //address

      $(this).on("click", function () {
        selected_buyer = search_buyer.list[i];
        selected_buyer.address_id = null;
        // Logger.d(selected_buyer);
        $findcustomer.hide();
        $selected_customer_image.attr(
          "alt",
          selected_buyer.first_name + " " + selected_buyer.last_name
        );
        $selected_customer_name.text(
          selected_buyer.first_name + " " + selected_buyer.last_name
        );
        $selected_customer_email_href.attr(
          "href",
          "mailto:" + selected_buyer.email
        );
        $selected_customer_email.text(selected_buyer.email);

        //fetch address
        $.ajax({
          url: "/admin/users/addresses/" + selected_buyer.id,
          data: {
            csrf_token: $("#csrf_token").val(),
          },
          type: "POST",
          dataType: "json",
          beforeSend: function () {
            selected_buyer.address_id = null;
            $selected_customer_addresses.empty();
            $address_info.empty();
          },
          success: function (result) {
            if (result.length) {
              $.each(result, function (i, v) {
                const full_address = v.line1 + " " + v.city + " " + v.province;
                $selected_customer_addresses.append(
                  `<option value="` + v.id + `">` + full_address + `</option>`
                );
              });
              $selected_customer_addresses.on("change", function () {
                const index = $selected_customer_addresses[0].selectedIndex;
                if (!result[index]) {
                  return false;
                }
                selected_buyer.address_id = result[index].id;
                // console.log(selected_buyer.address_id);

                $address_info.empty();

                $address_info.append(
                  `
                  <div>` +
                    result[index].firstName +
                    " " +
                    result[index].lastName +
                    `</div>
                  <div>` +
                    result[index].mobile +
                    `</div>
                  <div><a href="mailto:` +
                    result[index].email +
                    `">` +
                    result[index].email +
                    `</a></div>
                  <div>` +
                    result[index].line1 +
                    " " +
                    result[index].city +
                    " " +
                    result[index].province +
                    `</div>
                  <div><a target="_blank" href="https://maps.google.com/?q=` +
                    result[index].line1 +
                    " " +
                    result[index].city +
                    " " +
                    result[index].province +
                    `" class="hover-underline">See on maps</a></div>
                `
                );
              });
              $selected_customer_addresses.trigger("change");
            }
            orderButton();
          },
          error: function () {
            orderButton();
            toast("error", "Error has occurred. Try again.");
          },
        });

        $remove_buyer.on("click", function () {
          selected_buyer = null;
          search_buyer.offset = 0;
          search_buyer.list = [];
          $selected_customer.hide();
          $findcustomer.show();
          orderButton();
        });
        $selected_customer.show();
      });
    });
  }

  function searchBuyer() {
    if (ajax_search_buyer !== null) {
      ajax_search_buyer.abort();
    }

    var resetEl = function () {
      if (search_buyer.offset <= 0) {
        $("#btn_buyer_prev").prop("disabled", true);
      } else {
        $("#btn_buyer_prev").prop("disabled", false);
      }
      if (search_buyer.list.length <= 0) {
        $("#btn_buyer_next").prop("disabled", true);
      } else {
        $("#btn_buyer_next").prop("disabled", false);
      }

      $(".buyer_result").find(".has-loading").hide();
    };

    ajax_search_buyer = $.ajax({
      url: "/admin/users/list",
      data: {
        csrf_token: $("#csrf_token").val(),
        search: $("#txt_buyer").val(),
        offset: search_buyer.offset,
        limit: search_buyer.limit,
      },
      type: "POST",
      dataType: "json",
      beforeSend: function () {
        $("#buyer_results_list").empty();
        $(".buyer_result").find(".has-loading").show();
        $("#btn_product_prev", "#btn_product_next").prop("disabled", true);
        search_buyer.list = [];
      },
      success: function (result) {
        search_buyer.list = result;

        $.each(result, function (i, v) {
          var html_buyers = ``;

          html_buyers =
            `<li class="row buyer-row">
                                                    <div class="flexbox-grid-default flexbox-align-items-center">
                                                        <div class="flexbox-auto-40">
                                                            <div class="wrap-img inline_block vertical-align-t radius-cycle"><img src="` +
            APP_DISK +
            `/users/default.png` +
            `" alt="Leone Hand I" class="thumb-image radius-cycle"></div>
                                                        </div>
                                                        <div class="flexbox-auto-content-right">
                                                            <div class="overflow-ellipsis">` +
            v.first_name +
            " " +
            v.last_name +
            `</div>
                                                            <div class="overflow-ellipsis"><a href="mailto:` +
            v.email +
            `"><span>` +
            v.email +
            `</span></a></div>
                                                        </div>
                                                    </div>
                                                </li>`;

          $("#buyer_results_list").append(html_buyers);
        });

        if (!result.length) {
          if (search_buyer.offset) {
            $("#buyer_results_list").append(
              `<li class="item-not-selectable">No more results...</li>`
            );
          } else {
            $("#buyer_results_list").append(
              `<li class="item-not-selectable">No results...</li>`
            );
          }
        } else {
          buyerSelectionEvent();
        }
        resetEl();
      },
      error: function () {
        resetEl();
        toast("error", "Error has occurred. Try again.");
      },
    });
  }

  function initBuyerSearchElements() {
    $("#txt_buyer").on("focusin", function () {
      $(".buyer_result").addClass("active").removeClass("hidden");
      if (!search_buyer.offset && !search_buyer.list.length) {
        searchBuyer();
      } else {
        $(".buyer_result").find(".has-loading").hide();
        //  Logger.d(search_product.list)
      }
    });

    $("#txt_buyer").on(
      "keyup",
      delay(function (e) {
        search_buyer.offset = 0;
        search_buyer.list = [];
        searchBuyer();
      }, 1000)
    );

    $("#btn_buyer_next").on("click", function () {
      search_buyer.offset = search_buyer.offset + search_buyer.limit;
      searchBuyer();
    });

    $("#btn_buyer_prev").on("click", function () {
      search_buyer.offset = search_buyer.offset - search_buyer.limit;
      searchBuyer();
    });

    $(document).mouseup(function (e) {
      var buyer_box = $(".buyer_box");
      // if the target of the click isn't the container nor a descendant of the container
      if (!buyer_box.is(e.target) && buyer_box.has(e.target).length === 0) {
        $(".buyer_result").removeClass("active").addClass("hidden");
      }
    });
  }

  function createOrder(payment_type) {
    $.ajax({
      url: "/admin/orders/payment",
      data: {
        csrf_token: $("#csrf_token").val(),
      },
      type: "POST",
      dataType: "json",
      beforeSend: function () {
        $modal_container.empty();
      },
      success: function (result) {
        $modal_container.html(result.data);

        var $modal_order = $("#modal_order");
        $modal_order.modal("show");
        // alert("debugger");

        $modal_order.on("hidden.bs.modal", function () {
          $(this).remove();
        });

        var $payment_method = $("#payment_method");
        var $btn_save_order = $("#btn_save_order");
        var $modal_order_amount = $(".modal_order_amount");

        $payment_method.on("change", function () {
          if ($.inArray($(this).val(), result.payments) != -1) {
            selected_payment = $(this).val();
          }
        });

        $payment_method.trigger("change");

        $modal_order_amount.text(
          (payment_type == "completed" ? "Paid amount: " : "Pending amount: ") +
            currencyNumberFormat(totalAmount())
        );

        $btn_save_order.on("click", function () {
          $.ajax({
            url: "/admin/orders/store",
            data: {
              csrf_token: $("#csrf_token").val(),
              data: {
                store: selected_products,
                buyer: selected_buyer,
                payment: { channel: selected_payment, status: payment_type },
              },
            },
            type: "POST",
            dataType: "json",
            beforeSend: function () {
              $btn_save_order.prop("disabled", true);
            },
            success: function (result) {
              if (parseInt(result.status)) {
                $remove_buyer.trigger("click");

                selected_products = [];
                displaySelectedProduct();

                window.location.replace("/admin/orders");
                $modal_order.modal("hide");
                return false;
              } else {
                toast("error", result.message);
                $btn_save_order.prop("disabled", false);
              }
            },
            error: function () {
              toast("error", "Error has occurred. Try again.");
              $btn_save_order.prop("disabled", false);
            },
          });
        });
      },
      error: function () {
        toast("error", "Error has occurred. Try again.");
      },
    });
  }

  $(function () {
    initProductSearchElements();
    initBuyerSearchElements();
  });
})();
