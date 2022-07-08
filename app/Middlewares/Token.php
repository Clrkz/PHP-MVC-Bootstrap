<?php

namespace App\Middlewares;

use Pecee\Http\Middleware\IMiddleware;
use Pecee\Http\Request;
use Firebase\JWT\JWT;
use App\Utilities\Cookie;
use App\Utilities\Auth;

class Token implements IMiddleware
{

    public function handle(Request $request): void
    {
        $id = null;
        if (empty(Auth::user()->id)) {
            $id = session_id();
        } else {
            $id = Auth::user()->id;
        }

        $secretKey  = hash_hmac('sha256', $id,  env('APP_KEY'));
        $tokenId    = base64_encode(random_bytes(16));
        $issuedAt   = new \DateTimeImmutable();
        $expire     = $issuedAt->modify('+30 minutes')->getTimestamp(); // Add 60 seconds
        $serverName = env('APP_URL');

        // Create the token as an array
        $data = [
            'iat'  => $issuedAt->getTimestamp(),    // Issued at: time when the token was generated
            'jti'  => $tokenId,                     // Json Token Id: an unique identifier for the token
            'iss'  => $serverName,                  // Issuer
            'nbf'  => $issuedAt->getTimestamp(),    // Not before
            'exp'  => $expire,                      // Expire
            'data' => [                             // Data related to the signer user
                'id' => $id, // User name
            ]
        ];

        // Encode the array to a JWT string.
        $jwt =  JWT::encode(
            $data,      //Data to be encoded in the JWT
            $secretKey, // The signing key
            'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );
        Cookie::put("Authorization", $jwt, (86400 * 30), '/', 'Strict', false, true);
        // response()->json(['key' => $jwt]);
        // echo $jwt;
    }
}
