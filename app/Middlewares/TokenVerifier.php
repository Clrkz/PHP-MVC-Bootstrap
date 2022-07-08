<?php

namespace App\Middlewares;

use Pecee\Http\Middleware\IMiddleware;
use Pecee\Http\Request;
use App\Utilities\Cookie;
use App\Utilities\Session;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Utilities\Auth;

class TokenVerifier implements IMiddleware
{

    public function handle(Request $request): void
    {
        // Do authentication
        // $request->authenticated = true;

        // if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
        //     header('HTTP/1.0 400 Bad Request');
        //     exit;
        // }

        $id = null;
        if (empty(Auth::user()->id)) {
            $id = session_id();
        } else {
            $id = Auth::user()->id;
        }


        // $jwt = $matches[1];
        // Using httponly cookies
        $jwt = Cookie::get('Authorization');
        //$jwt = ""; //debug

        // echo $jwt;
        // exit;

        if (!$jwt) {
            // No token was able to be extracted from the authorization header
            header('HTTP/1.0 400 Bad Request');
            exit;
        }

        $secretKey  =  hash_hmac('sha256', $id,  env('APP_KEY')); //env('APP_KEY');
        // $token = JWT::decode((string)$jwt, $secretKey, ['HS512']);
        try {
            JWT::$leeway += 60;
            $token = JWT::decode($jwt, new Key($secretKey, 'HS512'));

            $now = new \DateTimeImmutable();
            $serverName = env('APP_URL');

            if (
                $token->iss !== $serverName ||
                $token->nbf > $now->getTimestamp() ||
                $token->exp < $now->getTimestamp() ||
                $token->data->id !== $id
            ) {
                header('HTTP/1.1 401 Unauthorized');
                exit;
            }
        } catch (\Exception $e) {
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
    }
}
