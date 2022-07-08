<?php

use App\Router;


Router::group(['middleware' => \App\Middlewares\Token::class], function () {
    Router::group(['middleware' => \App\Middlewares\NotAuth::class], function () {
        Router::get('/login', 'AuthController@loginIndex')->setName('login');
    });
    Router::get('/logout', 'AuthController@logout')->setName('logout');
});

Router::group(['middleware' => \App\Middlewares\TokenVerifier::class], function () {
    Router::post('/login', 'AuthController@loginData')->setName('login.data');
});
