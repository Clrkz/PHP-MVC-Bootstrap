<?php

namespace App\Middlewares;

use Pecee\Http\Middleware\IMiddleware;
use Pecee\Http\Request;

use App\Models\User;
use App\Utilities\Session;

class NotAuth implements IMiddleware
{

    public function handle(Request $request): void
    {
        if (!empty(Session::get('uid'))) {
            response()->redirect(url('main'));
        }
    }
}
