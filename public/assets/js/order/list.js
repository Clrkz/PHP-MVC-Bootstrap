/*
 * Author: Clarence A Andaya
 * Date: July 06 2022
 */

//Only const Variable Here
(function () {
  "use strict";
  //Logic,Variables, Functions Here

  var myList = null;
  var search_type_filter = [];

  function delay(callback, ms) {
    var timer = 0;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }

  function initActionRemove() {
    $("[data-action-remove]").each(function () {
      $(this).on("click", function () {
        var row = $(this).closest("tr");
        //  var data = myList.row(row).data().id;
        //  console.log(data);
        //  return false;
        const product_id = myList.row(row).data().id; //$(this).attr('data-action-remove');
        Swal.fire({
          title: "Are you sure, you want to remove this product?",
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
            $.ajax({
              url: "/admin/products/status",
              data: {
                id: product_id,
                status: 0,
                csrf_token: $("#csrf_token").val(),
              },
              type: "POST",
              dataType: "json",
              beforeSend: function () {
                toast("info", "Updating...");
              },
              success: function (result) {
                toast("success", result.message);
                myList.ajax.reload();
              },
              error: function () {
                toast("error", "Error has occurred. Try again.");
              },
            });
          }
        });
      });
    });
  }

  function initList() {
    //search
    $("#txt_search").on(
      "keyup",
      delay(function (e) {
        myList.search($("#txt_search").val()).draw();
      }, 500)
    );

    var search_type_default = "Customer";
    var search_types = ["ID", "Customer", "Order no."];

    $.each(search_types, function (i, n) {
      $(".product-search-type").append(
        `<li class="dropdown-item cursor-pointer py-0"><span class="text-sm">` +
          n +
          `</span></li>`
      );
    });

    $(".product-search-type li").each(function () {
      if ($(this).text() == search_type_default) {
        $(this).removeClass("active").addClass("active");
        var active_items_arr = [];
        active_items_arr.push(search_type_default);
        search_type_filter = JSON.stringify(active_items_arr);
      }

      $(this).on("click", function () {
        //remove all selected menu
        $(".product-search-type")
          .find("li.active")
          .map(function () {
            $(this).removeClass("active");
          });

        $(this).toggleClass("active");

        var active_items = $(".product-search-type")
          .find("li.active")
          .map(function () {
            var item = {};
            // item.id = this.value;
            item.status = $(this).text();
            return item;
          });

        var active_items_arr = [];
        $.each(active_items, function (i, n) {
          active_items_arr.push(n.status);
        });

        search_type_filter = JSON.stringify(active_items_arr);
        //  refreshOrcrPlateTable();
        //  if ($('#txt_search').val() != '') {
        myList.ajax.reload();
        //  }
      });
    });

    var tableId = "#tbl_list";

    // Delete a record
    $(tableId).on("click", "td.table-action > a action-delete", function (e) {
      e.preventDefault();

      console.log($(this).attr("data-id"));
      //  editor.remove($(this).closest('tr'), {
      //      title: 'Delete record',
      //      message: 'Are you sure you wish to remove this record?',
      //      buttons: 'Delete'
      //  });
    });

    var cols = [
      {
        title: "ID",
        data: null,
        className: "",
        orderable: true,
        width: "1%",
      },
      {
        title: "Customer",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "10%",
      },
      {
        title: "Amount",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      {
        title: "Tax Amount",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "10%",
      },
      {
        title: "Shipping Amount",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      {
        title: "Payment Method",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      {
        title: "Payment Status",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      {
        title: "Status",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      {
        title: "Created At",
        data: null,
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      {
        title: "Store",
        data: "store",
        className: "align-middle p-1 dt-center",
        orderable: true,
        width: "5%",
      },
      // {
      //   title: "Status",
      //   data: "status",
      //   className: "align-middle p-1 dt-center",
      //   orderable: true,
      //   width: "5%",
      //   render: function (data, type, row, meta) {
      //     var status = `<span class="text-sm badge badge-warning font-weight-normal">Unpublished</span>`;
      //     if (row.status == 1) {
      //       status = `<span class="text-sm badge badge-success font-weight-normal">Published</span>`;
      //     } else if (row.status == 2) {
      //       status = `<span class="text-sm badge badge-danger font-weight-normal">Draft</span>`;
      //     }

      //     return status;
      //     // ? `<span class="text-sm badge badge-primary font-weight-normal">Published</span>`
      //     // : `<span class="text-sm badge badge-warning font-weight-normal">Unpublished</span>`;
      //   },
      // },
      {
        title: "Action",
        data: null,
        orderable: false,
        width: "5%",
        className: "align-middle p-1 dt-center",

        render: function (data, type, row, meta) {
          return (
            `
                   <div class="row justify-content-center">
                           <a href="/admin/products/edit/` +
            row.id +
            `" style="cursor:pointer;" class="m-1 btn btn-sm btn-primary btn-icon" title="Edit"><i class="fa fa-pen"></i></a> 
                           <a data-action-remove style="cursor:pointer;" class="m-1 btn btn-sm btn-danger btn-icon" title="Remove"><i class="fa fa-trash"></i></a>
                   </div>
                   `
          );
        },
      },
    ];

    myList = $(tableId).DataTable({
      //  fnInitComplete: function() {
      //      initActionRemove();
      //  },
      fnDrawCallback: function () {
        initActionRemove();
      },
      //  columnDefs: [{
      //      width: 200,
      //      targets: 0
      //  }],
      retrieve: true,
      columns: cols,
      //  data: data,
      paging: true,
      lengthChange: false,
      searching: true,
      //  ordering: true,
      pageLength: 10,
      info: true,
      autoWidth: false,
      responsive: true,
      processing: true,
      fixedColumns: true,
      serverSide: true,
      //  ajax: "/admin/products/list",
      ajax: {
        url: "/admin/orders/list",
        data: function (d) {
          return $.extend({}, d, {
            search_type: search_type_filter,
          });
        },
      },
      sDom: "lrtip",
    });
  }

  $(function () {
    initList();
    $(document).on("click", ".dropdown-filter,.daterangepicker", function (e) {
      e.stopPropagation();
    });

    $("#reload-list").on("click", function () {
      myList.ajax.reload();
    });
    $("#filter-list").on("click", function () {
      $("#filter-list-section").toggleClass("hidden");
    });
  });
})();
