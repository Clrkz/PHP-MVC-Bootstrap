<?php

namespace App\Middlewares;

use Pecee\Http\Middleware\IMiddleware;
use Pecee\Http\Request;
use Firebase\JWT\JWT;
use App\Utilities\Cookie;
use App\Utilities\Session;
use App\Models\User;

class Auth implements IMiddleware
{

    public function handle(Request $request): void
    {

        $user = new User();
        if (empty(Session::get('uid')) && empty(Cookie::get('uid'))) {
            Cookie::put("ref", url(), (86400 * 30), '/', 'Strict', false, true);
            response()->redirect(url('login'));
        }

        //login using cookie
        if (empty(Session::get('uid')) && !empty(Cookie::get('uid'))) {
            $user_id =  $user->getUserIdBySessionToken(array(Cookie::get('uid')));
            $user_data = $user->getUser(array($user_id));
            if (empty($user_data)) {
                response()->redirect(url('logout'));
            }
            Session::set(['uid' => $user_data['id'], 'agent' => $_SERVER['HTTP_USER_AGENT']]);
        }

        //check user status
        if (empty($user->getUserStatus(array(Session::get('uid'))))) {
            response()->redirect(url('logout'));
        }
    }
}
