function isEmptyField($element, msg) {
  if (isEmpty($element.val())) {
    $element.trigger("focus");
    // alert message
    toastr.remove();
    toastr.error(msg);
    return true;
  } else {
    return false;
  }
}

function isEmpty(string) {
  // alert(string)
  var flag = false;
  try {
    if (string == null) {
      flag = true;
    } else if (typeof string === "undefined") {
      flag = true;
    } else if (string.trim() == "") {
      flag = true;
    }
  } catch (err) {
    Log.e(err);
    flag = true;
  }
  return flag;
}

function resetForm(id) {
  $("#" + id)[0].reset();
}

function formJson(attribute, $element) {
  var /* Create an object. */
    obj = {},
    /* Create a variable that references the current object (default → obj). */
    ref = obj;
  /* Iterate over every input. */
  $element.each(function () {
    /* Cache the id of the input. */
    var name = $(this).attr("name");
    /* Check whether the nodetype attribute is set to 'parent'. */
    if (this.getAttribute(attribute) == "parent") {
      /* Set a new object to the property and set ref to refer to it. */
      ref = obj[name] = {};
    } else {
      /* Set the value of the input to the referred object. */
      if (this.hasAttribute(attribute)) {
        if (isEmpty($(this).val())) {
          ref[name] = "";
        } else {
          ref[name] = $(this).val().trim();
        }
      }
    }
  });
  /* Stringify the object and return it. */
  return JSON.stringify(obj);
}

function formObj(attribute, $element) {
  var /* Create an object. */
    obj = {},
    /* Create a variable that references the current object (default → obj). */
    ref = obj;
  /* Iterate over every input. */
  $element.each(function () {
    /* Cache the id of the input. */
    var name = $(this).attr("name");
    /* Check whether the nodetype attribute is set to 'parent'. */
    if (this.getAttribute(attribute) == "parent") {
      /* Set a new object to the property and set ref to refer to it. */
      ref = obj[name] = {};
    } else {
      /* Set the value of the input to the referred object. */
      if (this.hasAttribute(attribute)) {
        if (isEmpty($(this).val())) {
          ref[name] = "";
        } else {
          ref[name] = $(this).val().trim();
        }
      }
    }
  });
  /* Stringify the object and return it. */
  return obj;
}

function removeSubmitButtonOffsetOn(tabs, tabsSelector = null) {
  tabs = Array.isArray(tabs) ? tabs : [tabs];

  $(tabsSelector || ".vert-tabs-tab > a").on("click", (e) => {
    if (tabs.includes(e.currentTarget.getAttribute("href"))) {
      setTimeout(() => {
        $("button[type=submit]").parent().removeClass("offset-md-2");
      }, 150);
    } else {
      setTimeout(() => {
        $("button[type=submit]").parent().addClass("offset-md-2");
      }, 150);
    }
  });
}

//Start Common Layout Scripts
function signout() {
  let url = window.location.origin;
  window.location.replace(url + "/logout");
}
function lock() {
  alert("lock");
}
function profile() {
  alert("profile");
}
function settings() {
  alert("Settings");
}
function sidebarHighlight() {
  // remove params and fragments
  var url = window.location.href.split("#")[0];
  url = url.split("?")[0];

  const url_arr = url.split("/");
  // for sidebar menu entirely but not cover treeview
  $("ul.nav-sidebar a")
    .filter(function () {
      var href_arr = this.href.split("/");
      // console.log(href_arr);
      // console.log( url_arr[4]  +' -  '+ href_arr[4]);
      if (
        this.href == url ||
        this.href + "/" == url ||
        (url_arr[4] == href_arr[4] && $(this).attr("href") != "#")
      ) {
        return true;
      } else {
        return false;
      }

      //  return this.href == url;
    })
    .addClass("active");

  // for treeview
  $("ul.nav-treeview a")
    .filter(function () {
      var href_arr = this.href.split("/");
      if (
        this.href == url ||
        this.href + "/" == url ||
        (url_arr[4] == href_arr[4] && $(this).attr("href") != "#")
      ) {
        return true;
      } else {
        return false;
      }
      //  return this.href == url;
    })
    .parentsUntil(".nav-sidebar > .nav-treeview")
    .addClass("menu-open");
}
//End Common Layout Scripts

function closeAlert(id) {
  var unsaved = false;

  $("#" + id)
    .find("input,textarea,select")
    .on("change keyup paste", function () {
      // console.log("test: " + $(this).attr("name"));
      unsaved = true;
    });

  function unloadPage() {
    if (unsaved) {
      return "You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?";
    }
  }

  window.onbeforeunload = unloadPage;
}

function removeCloseAlert() {
  window.onbeforeunload = function (evt) {
    return null;
  };
}

function responsiveDatatablesTab() {
  $('a[data-toggle="pill"]').on("shown.bs.tab", function (e) {
    $($.fn.dataTable.tables(true))
      .DataTable()
      .columns.adjust()
      .responsive.recalc();
  });
}

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

$(function () {
  $(".header_settings").on("click", function (evt) {
    settings();
  });
  $(".header_profile").on("click", function (evt) {
    profile();
  });
  $(".header_lock").on("click", function (evt) {
    lock();
  });
  $(".header_signout").on("click", function (evt) {
    signout();
  });

  // $(".select2").select2();
  if ($.isFunction($.fn.select2)) {
    $(".select2bs4").select2({
      theme: "bootstrap4",
    });

    $(".select2bs4_nosearch").select2({
      theme: "bootstrap4",
      minimumResultsForSearch: -1,
    });
  }

  sidebarHighlight();
});

//default options
toastr.options = {
  closeButton: true,
  debug: false,
  progressBar: true,
  positionClass: "toast-top-right",
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function clearInputFields(divElement) {
  var ele = document.getElementById(divElement);
  // IT WILL READ ALL THE ELEMENTS. <p>, <div>, <input> ETC.
  for (i = 0; i < ele.childNodes.length; i++) {
    // SINCE THE <input> FIELDS ARE INSIDE A <p> TAG,
    // I'LL USE THE "firstChild" PROPERTY TO GET THE <input> TAG.
    var child = ele.childNodes[i].firstChild;
    //console.log(child);

    // CHECK IF CHILD NOT NULL.
    // THIS IS IMPORTANT AS IT WILL RETURN A TEXT FOR EVERY "Whitespace".
    // 'Whitespace' IS A TEXT OR NODE BETWEEN <div> AND <p> AND AFTER <p>.
    if (child) {
      switch (child.type) {
        case "button":
        case "text":
        case "submit":
        case "password":
        case "file":
        case "email":
        case "date":
        case "number":
          child.value = "";
        case "checkbox":
        case "radio":
          child.checked = false;
      }
    }
  }
}

function toast(type = "info", msg) {
  toastr.remove();
  switch (type) {
    case "info":
      toastr.info(msg);
      break;
    case "error":
      toastr.error(msg);
      break;
    case "success":
      toastr.success(msg);
      break;
    case "warning":
      toastr.warning(msg);
      break;
    default:
      toastr.info(msg);
  }
}
