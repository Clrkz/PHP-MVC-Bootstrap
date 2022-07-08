<?php

namespace App\Utilities;

use App\Utilities\Session;

class Auth
{
    private static $instance;

    function __construct()
    {
        if (!empty(Session::get('uid'))) {
            $user = new \App\Models\User;
            $response = $user->getUser(array(Session::get('uid')));
            foreach ($response as $key => $value) {
                $this->{$key} = $value;
            }
        }
    }

    public static function check()
    {
        if (!empty(Session::get('uid'))) {
            return true;
        }
        return false;
    }

    public static function user()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
