<?php

use App\Router;

Router::group(['middleware' => \App\Middlewares\Auth::class], function () {
    Router::get('/auth_generate', function () {
        echo \App\Utilities\Cookie::get('Authorization');
    });
});

Router::group(['middleware' => \App\Middlewares\AuthVerification::class], function () {
    Router::get('/auth_verify', function () {
        echo "Access Granted!";
    });
});

Router::get('/session', function () {
    session_unset();
    session_destroy();
});
