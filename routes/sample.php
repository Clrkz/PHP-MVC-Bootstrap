<?php

use App\Router;

//check if user is authenticated
Router::group(['middleware' => \App\Middlewares\Auth::class], function () {
    //web prefix for multiple root entries
    Router::group(['prefix' => '/users'], function () {
        //give access token to view
        Router::group(['middleware' => \App\Middlewares\Token::class], function () {
            Router::get('/', 'Admin\UsersController@index')->setName('users.index');
            Router::get('/create', 'Admin\UsersController@createIndex')->setName('users.create.index');
            Router::get('/edit/{id}', 'Admin\UsersController@updateIndex')->setName('users.update.index')->where(['id' => '[0-9]+']);
        });
        //verify token 
        Router::group(['middleware' => \App\Middlewares\TokenVerifier::class], function () {
            Router::get('/list', 'Admin\UsersController@list')->setName('users.list');
            Router::post('/store', 'Admin\UsersController@store')->setName('users.store'); //add and update data
        });
    });
});
