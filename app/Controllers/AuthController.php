<?php

namespace App\Controllers;

use App\Core\View;
use App\Utilities\Hash;
use App\Utilities\Session;
use App\Utilities\Cookie;
use App\Utilities\Token;
use App\Core\Controller;
use App\Models\Permission;

class AuthController extends Controller
{
    public static function logout()
    {
        $_SESSION = [];
        session_unset();
        session_destroy();

        if (Cookie::exists('uid')) {
            Cookie::delete('uid');
        }

        // response()->redirect('/');
        response()->redirect(url('login'));
    }

    public static function login()
    {
    }

    public static function loginIndex()
    {
        // $http_referer = escape(input('ref'));
        View::render('login', get_defined_vars());
    }

    public function loginData()
    {
        $email = input('email');
        $username = input('username');
        $password = input('password');
        $remember = input('remember');

        $user = new \App\Models\User;

        $user_data = $user->getUserByEmail(array($email));

        $response['status'] = 0;

        if (!$user_data) {
            $response['message'] = "User is not registered.";
            response()->json($response);
        }

        if (!Hash::verify($password, $user_data['password'])) {
            $response['message'] = "Incorrect password.";
            response()->json($response);
        }

        if (!$user_data['status']) {
            $response['message'] = "Account is disabled.";
            response()->json($response);
        }

        if (!$user_data['active']) {
            $response['message'] = "Account is not yet verified.";
            response()->json($response);
        }

        if (!$user_data['is_admin']) {
            $response['message'] = "You do not have admin privileges.";
            response()->json($response);
        }

        //save user session 
        Session::set(['uid' => $user_data['id'], 'agent' => $_SERVER['HTTP_USER_AGENT']]);

        //save remember cookie
        $token = Token::generate();
        $user->createLoginToken(array($user_data['id'], $token));

        if ($remember) {
            // Cookie::put("uid", $token, (86400 * 30), '/', 'None', env('APP_URL'), false, false);
            // Cookie::put("uid", $token, (86400 * 30), '/');
            Cookie::put("uid", $token, (86400 * 30), '/', 'Strict', false, true);
        }

        $user->createLastLoginDate(array($user_data['id']));

        $response['id'] = $user_data['id'];
        $response['ref'] = empty(Cookie::get('ref')) ? url('main') : Cookie::get('ref');
        $response['status'] = 1;
        $response['message'] = "Login successful.";

        if (Cookie::exists('ref')) {
            Cookie::delete('ref');
        }

        response()->json($response);
    }
}
