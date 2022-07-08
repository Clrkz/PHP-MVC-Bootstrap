<!DOCTYPE html>
<html lang="en">

<head>
    <?php self::render('common/meta'); ?>
    <!-- insert custom meta here -->

    <title><?= env('APP_NAME') ?></title>

    <?php self::render('common/css'); ?>
    <!-- insert custom css here -->

</head>

<body class="hold-transition login-page text-sm ">
    <div class="login-box">
        <!-- /.login-logo -->
        <div class="card card-outline card-primary">
            <div class="card-header text-center">
                <a href="/" class="h1"><?= env('APP_NAME') ?></a>
            </div>
            <div class="card-body">
                <p class="login-box-msg">Sign in to start your session</p>
                <form id="signinForm" enctype="multipart/form-data">
                    <input type="hidden" name="csrf_token" id="csrf_token" value="<?= csrf_token(); ?>">
                    <div class="form-group mb-3">
                        <div class="input-group">
                            <input type="email" name="email" data-json id="txt_email" class="form-control form-control-sm" placeholder="Email">
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <div class="input-group ">
                            <input type="password" autocomplete="off" name="password" data-json class="form-control form-control-sm" id="txt_password" placeholder="Password">
                            <div class="input-group-append" id="toggle_pwd" role="button">
                                <div class="input-group-text" id="toggle_eye">
                                    <span class="fas fa-eye"></span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="row">
                        <div class="col-8">
                            <div class="icheck-primary">
                                <input type="checkbox" data-json value="0" name="remember" id="chk_remember">
                                <label for="chk_remember">
                                    Remember Me
                                </label>
                            </div>
                        </div>
                        <!-- /.col -->
                </form>
                <div class="col-4">
                    <button id="btn_signin" type="submit" class="btn btn-sm btn-primary btn-block">Sign In</button>
                </div>
                <!-- /.col -->
            </div>
            <p class="mb-1">
                <a href="/forgot">I forgot my password</a>
            </p>
            <?php
            // echo '<p class="mb-0">
            //     <a href="/signup" class="text-center">Register a new membership</a>
            // </p>';
            ?>

        </div>
        <!-- /.card-body -->
    </div>
    <!-- /.card -->
    </div>
    <!-- /.login-box -->
    <!-- common sctipts -->
    <?php self::render('common/script');  ?>
    <script src="<?= asset_version("/assets/js/login.js") ?>"></script>
</body>

</html>