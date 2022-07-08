<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Utilities\Auth;

class TestController extends Controller
{

    public static function test()
    {
        // echo Auth::user()->meow3;
        $id = null;
        if (empty(Auth::user()->id)) {
            $id = session_id();
        } else {
            $id = Auth::user()->id;
        }

        echo $id;
    }
}
