    <!-- jQuery -->
    <script src="<?= asset_version("/assets/core/plugins/jquery/jquery.min.js") ?>"></script>
    <!-- jQuery UI 1.11.4 -->
    <script src="<?= asset_version("/assets/core/plugins/jquery-ui/jquery-ui.min.js") ?>"></script>
    <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script>
        $.widget.bridge('uibutton', $.ui.button)
    </script>
    <!-- Bootstrap 4 -->
    <script src="<?= asset_version("/assets/core/plugins/bootstrap/js/bootstrap.bundle.min.js") ?>"></script>
    <!-- overlayScrollbars -->
    <script src="<?= asset_version("/assets/core/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js") ?>"></script>
    <!-- AdminLTE App -->
    <script src="<?= asset_version("/assets/core/dist/js/adminlte.js") ?>"></script>
    <!-- SweetAlert2 -->
    <script src="<?= asset_version("/assets/core/plugins/sweetalert2/sweetalert2.min.js") ?>"></script>
    <!-- Toastr -->
    <script src="<?= asset_version("/assets/core/plugins/toastr/toastr.min.js") ?>"></script>
    <!-- jquery-validation -->
    <script src="<?= asset_version("/assets/core/plugins/jquery-validation/jquery.validate.min.js") ?>"></script>
    <script src="<?= asset_version("/assets/core/plugins/jquery-validation/additional-methods.min.js") ?>"></script>
    <!-- Lodash File -->
    <script src="<?= asset_version("/assets/plugins/lodash/lodash.min.js") ?>"></script>
    <!-- JQuery Cookie -->
    <script src="<?= asset_version("/assets/plugins/jquery.cookie/jquery.cookie.min.js") ?>"></script>
    <!-- Generic JS File -->
    <!-- <script src="<?= ''/*asset_version("/assets/js/main.js")*/ ?>"></script> -->
    <script>
        const APP_DISK = '/<?= env('APP_DISK') ?>/';
        const APP_URL = '<?= env('APP_URL') ?>';
        const APP_DEBUG = <?= env('APP_DEBUG') ?>;

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

        function sidebarHighlight() {
            // remove params and fragments
            var url = window.location.href.split("#")[0];
            url = url.split("?")[0];

            const url_arr = url.split("/");
            // for sidebar menu entirely but not cover treeview
            $("ul.nav-sidebar a")
                .filter(function() {
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
                .filter(function() {
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

        function delay(callback, ms) {
            var timer = 0;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    callback.apply(context, args);
                }, ms || 0);
            };
        }

        $(function() {
            $(".header_settings").on("click", function(evt) {
                Log.e('Settings');
            });
            $(".header_profile").on("click", function(evt) {
                Log.e('Profile');
            });
            $(".header_lock").on("click", function(evt) {
                Log.e('Lock');
            });
            $(".header_signout").on("click", function(evt) {
                Log.e('Signout');
            });

            sidebarHighlight();
        });
    </script>
    <!-- Logger JS -->
    <script src="<?= asset_version("/assets/js/log.js") ?>"></script>