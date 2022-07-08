<?php

use App\Router;


Router::get('/test', 'TestController@test')->setName('test');

Router::group(['middleware' => \App\Middlewares\Auth::class], function () {
    Router::group(['middleware' => \App\Middlewares\Admin::class], function () {
        Router::get('/', 'DefaultController@mainIndex')->setName('main');
    });

    Router::get('/user_access', function () {
        echo "Not admin";
    })->setName('user.access');
});
