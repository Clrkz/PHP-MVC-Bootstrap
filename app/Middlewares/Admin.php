<?php

namespace App\Middlewares;

use Pecee\Http\Middleware\IMiddleware;
use Pecee\Http\Request;
use Firebase\JWT\JWT;
use App\Utilities\Cookie;
use App\Utilities\Session;
use App\Utilities\Auth;

class Admin implements IMiddleware
{

    public function handle(Request $request): void
    {
        if (empty(Session::get('uid')) && empty(Cookie::get('uid'))) {
            Cookie::put("ref", url(), (86400 * 30), '/', 'Strict', false, true);
            response()->redirect(url('login'));
        }
        if (!Auth::user()->is_admin) {
            response()->redirect(url('user_access'));
        }
    }
}
