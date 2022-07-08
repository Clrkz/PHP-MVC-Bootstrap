<?php

namespace App\Utilities;

use Ramsey\Uuid\Uuid;
// use App\Core\View; 

class Token
{
    public static function generate()
    {
        return Uuid::uuid4();
    }
}
